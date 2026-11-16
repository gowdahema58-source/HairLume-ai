import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { recommendProductsForCategory } from './src/data/catalog';
import type { GenderOption, UserProfile } from './src/types/hairlume';
import { analyzeHairImageWithGemini } from './server/ai';
import {
  authenticateUser,
  createSession,
  createUser,
  deleteAnalysis,
  deleteSession,
  deleteUserByAdmin,
  getAdminOverview,
  getAnalysesByUser,
  getAnalysisById,
  getUserBySessionToken,
  saveAnalysis,
  saveContactMessage,
  updateContactStatus,
  updateUserPassword,
  updateUserProfile,
} from './server/db';

interface AuthenticatedRequest extends Request {
  user?: UserProfile;
  sessionToken?: string;
}

function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return null;
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }
  const user = getUserBySessionToken(token);
  if (!user) {
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    return;
  }
  req.user = user;
  req.sessionToken = token;
  next();
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Administrator privileges required.' });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '12mb' }));

  // Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Authentication Routes
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, password, gender, age, hairType } = req.body as {
        name?: string;
        email?: string;
        password?: string;
        gender?: GenderOption;
        age?: number;
        hairType?: string;
      };

      if (!name || !name.trim()) {
        res.status(400).json({ error: 'Full name is required.' });
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ error: 'Please enter a valid email address.' });
        return;
      }
      if (!password || password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters.' });
        return;
      }
      const parsedAge = Number(age);
      if (!Number.isFinite(parsedAge) || parsedAge < 13 || parsedAge > 100) {
        res.status(400).json({ error: 'Please select a valid age between 13 and 100.' });
        return;
      }
      const validGender: GenderOption =
        gender === 'Male' || gender === 'Female' || gender === 'Other' ? gender : 'Female';

      const user = createUser({
        name,
        email,
        password,
        gender: validGender,
        age: Math.round(parsedAge),
        hairType,
      });
      const token = createSession(user.id);
      res.status(201).json({ token, user });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed.';
      res.status(400).json({ error: message });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }
    const user = authenticateUser(email, password);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }
    const token = createSession(user.id);
    res.json({ token, user });
  });

  app.post('/api/auth/logout', requireAuth, (req: AuthenticatedRequest, res) => {
    if (req.sessionToken) {
      deleteSession(req.sessionToken);
    }
    res.json({ ok: true });
  });

  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
    res.json({ user: req.user });
  });

  // Profile Routes
  app.put('/api/profile', requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      const { name, gender, age, hairType, washFrequencyDays } = req.body as {
        name?: string;
        gender?: GenderOption;
        age?: number;
        hairType?: string;
        washFrequencyDays?: number;
      };
      const updated = updateUserProfile(req.user!.id, {
        name,
        gender,
        age: age !== undefined ? Number(age) : undefined,
        hairType,
        washFrequencyDays: washFrequencyDays !== undefined ? Number(washFrequencyDays) : undefined,
      });
      res.json({ user: updated });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile.';
      res.status(400).json({ error: message });
    }
  });

  app.put('/api/profile/password', requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      const { currentPassword, newPassword } = req.body as {
        currentPassword?: string;
        newPassword?: string;
      };
      if (!currentPassword || !newPassword || newPassword.length < 6) {
        res.status(400).json({ error: 'New password must be at least 6 characters.' });
        return;
      }
      updateUserPassword(req.user!.id, currentPassword, newPassword);
      res.json({ ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password update failed.';
      res.status(400).json({ error: message });
    }
  });

  // Hair Image Validation & Gemini Vision AI Analysis
  app.post('/api/analyses/analyze', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { imageDataUrl, genderAtScan, ageAtScan, scalpNotes } = req.body as {
        imageDataUrl?: string;
        genderAtScan?: GenderOption;
        ageAtScan?: number;
        scalpNotes?: string;
      };

      if (!imageDataUrl || typeof imageDataUrl !== 'string') {
        res.status(400).json({ error: 'Please upload or capture a hair/scalp image first.' });
        return;
      }

      const match = imageDataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
      if (!match) {
        res.status(400).json({
          error: 'Unsupported image format. Please provide a valid JPEG, PNG, or WEBP photograph.',
        });
        return;
      }

      const mimeType = match[1] === 'image/jpg' ? 'image/jpeg' : match[1];
      const base64Data = match[2];
      const approxBytes = Math.floor((base64Data.length * 3) / 4);
      if (approxBytes < 1500) {
        res.status(400).json({ error: 'Image file appears empty or too small to analyze.' });
        return;
      }
      if (approxBytes > 8 * 1024 * 1024) {
        res.status(400).json({ error: 'Image size exceeds the 8 MB upload limit.' });
        return;
      }

      const scanGender: GenderOption =
        genderAtScan === 'Male' || genderAtScan === 'Female' || genderAtScan === 'Other'
          ? genderAtScan
          : req.user!.gender;
      const scanAge =
        Number.isFinite(Number(ageAtScan)) && Number(ageAtScan) >= 13
          ? Math.round(Number(ageAtScan))
          : req.user!.age;

      const aiResult = await analyzeHairImageWithGemini({
        base64Data,
        mimeType,
        gender: scanGender,
        age: scanAge,
        scalpNotes: scalpNotes?.trim() || '',
      });

      if (!aiResult.isValidHairImage) {
        res.status(422).json({
          error:
            aiResult.validationReason ||
            'No clear human hair or scalp was detected in this photo. Please capture or upload a well-lit hair/scalp view.',
        });
        return;
      }

      const recommendedProducts = recommendProductsForCategory(aiResult.primaryCategory);
      const saved = saveAnalysis({
        userId: req.user!.id,
        imageData: imageDataUrl,
        genderAtScan: scanGender,
        ageAtScan: scanAge,
        scalpNotes: scalpNotes?.trim() || '',
        primaryCategory: aiResult.primaryCategory,
        secondaryObservations: aiResult.secondaryObservations,
        confidenceScore: aiResult.confidenceScore,
        confidenceLabel: aiResult.confidenceLabel,
        hairHealthScore: aiResult.hairHealthScore,
        densityMetrics: aiResult.densityMetrics,
        scalpConcerns: aiResult.scalpConcerns,
        aiSummary: aiResult.aiSummary,
        limitationsNote: aiResult.limitationsNote,
        dermatologistFlag: aiResult.dermatologistFlag,
        recommendedProductIds: recommendedProducts.map((p) => p.id),
      });

      res.status(201).json({ analysis: saved });
    } catch (err) {
      console.error('AI Analysis Error:', err);
      const rawMessage = err instanceof Error ? err.message : 'Unable to analyze hair image.';
      if (rawMessage.includes('PERMISSION_DENIED') || rawMessage.includes('API_KEY_INVALID')) {
        res.status(403).json({
          error: 'AI service key error. Please verify GEMINI_API_KEY in Settings > Secrets.',
        });
        return;
      }
      if (rawMessage.includes('RESOURCE_EXHAUSTED')) {
        res.status(429).json({
          error: 'AI request quota temporarily reached. Please wait a moment and try again.',
        });
        return;
      }
      res.status(500).json({ error: rawMessage });
    }
  });

  app.get('/api/analyses', requireAuth, (req: AuthenticatedRequest, res) => {
    const analyses = getAnalysesByUser(req.user!.id);
    res.json({ analyses });
  });

  app.get('/api/analyses/:id', requireAuth, (req: AuthenticatedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid analysis ID.' });
      return;
    }
    const analysis = getAnalysisById(id, req.user!.id, req.user!.role === 'admin');
    if (!analysis) {
      res.status(404).json({ error: 'Analysis record not found.' });
      return;
    }
    res.json({ analysis });
  });

  app.delete('/api/analyses/:id', requireAuth, (req: AuthenticatedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid analysis ID.' });
      return;
    }
    const deleted = deleteAnalysis(id, req.user!.id, req.user!.role === 'admin');
    if (!deleted) {
      res.status(404).json({ error: 'Analysis record not found.' });
      return;
    }
    res.json({ ok: true });
  });

  // Contact Inquiry Route
  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };
    if (!name || !name.trim() || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Valid name and email address are required.' });
      return;
    }
    if (!subject || !subject.trim() || !message || message.trim().length < 8) {
      res.status(400).json({ error: 'Please include a subject and message (minimum 8 characters).' });
      return;
    }
    const saved = saveContactMessage({ name, email, subject, message });
    res.status(201).json({ message: saved });
  });

  // Admin Routes
  app.get('/api/admin/overview', requireAuth, requireAdmin, (_req, res) => {
    const data = getAdminOverview();
    res.json(data);
  });

  app.delete('/api/admin/users/:id', requireAuth, requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid user ID.' });
      return;
    }
    const ok = deleteUserByAdmin(id);
    if (!ok) {
      res.status(400).json({ error: 'Cannot remove admin account or user does not exist.' });
      return;
    }
    res.json({ ok: true });
  });

  app.patch('/api/admin/messages/:id', requireAuth, requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body as { status?: 'open' | 'resolved' };
    if (!Number.isFinite(id) || (status !== 'open' && status !== 'resolved')) {
      res.status(400).json({ error: 'Invalid status update request.' });
      return;
    }
    const ok = updateContactStatus(id, status);
    if (!ok) {
      res.status(404).json({ error: 'Message not found.' });
      return;
    }
    res.json({ ok: true });
  });

  // Vite Dev Middleware or Static Production Build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HAIRLUME AI running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

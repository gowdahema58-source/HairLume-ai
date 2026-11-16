import type { AnalysisRecord, ContactMessage, GenderOption, UserProfile } from '../types/hairlume';

const TOKEN_KEY = 'hairlume_session_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(path, { ...options, headers });
  const text = await response.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    data = { error: 'Unexpected server response.' };
  }

  if (!response.ok) {
    throw new Error((data.error as string) || `Request failed (${response.status})`);
  }
  return data as T;
}

export const api = {
  register: (payload: {
    name: string;
    email: string;
    password: string;
    gender: GenderOption;
    age: number;
    hairType: string;
  }) =>
    apiRequest<{ token: string; user: UserProfile }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    apiRequest<{ token: string; user: UserProfile }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () => apiRequest<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),

  me: () => apiRequest<{ user: UserProfile }>('/api/auth/me'),

  updateProfile: (payload: Partial<UserProfile>) =>
    apiRequest<{ user: UserProfile }>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  updatePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ ok: boolean }>('/api/profile/password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  analyzeHairImage: (payload: {
    imageDataUrl: string;
    genderAtScan: GenderOption;
    ageAtScan: number;
    scalpNotes: string;
  }) =>
    apiRequest<{ analysis: AnalysisRecord }>('/api/analyses/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listAnalyses: () => apiRequest<{ analyses: AnalysisRecord[] }>('/api/analyses'),

  deleteAnalysis: (id: number) =>
    apiRequest<{ ok: boolean }>(`/api/analyses/${id}`, { method: 'DELETE' }),

  submitContact: (payload: { name: string; email: string; subject: string; message: string }) =>
    apiRequest<{ message: ContactMessage }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getAdminOverview: () =>
    apiRequest<{
      users: Array<UserProfile & { analysisCount: number }>;
      analyses: Array<{
        id: number;
        user_id: number;
        userName: string;
        userEmail: string;
        gender_at_scan: string;
        age_at_scan: number;
        primary_category: string;
        confidence_score: number;
        hair_health_score: number;
        dermatologist_flag: number;
        created_at: string;
      }>;
      categoryBreakdown: Array<{ category: string; count: number }>;
      messages: ContactMessage[];
    }>('/api/admin/overview'),

  deleteAdminUser: (id: number) =>
    apiRequest<{ ok: boolean }>(`/api/admin/users/${id}`, { method: 'DELETE' }),

  updateAdminMessageStatus: (id: number, status: 'open' | 'resolved') =>
    apiRequest<{ ok: boolean }>(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

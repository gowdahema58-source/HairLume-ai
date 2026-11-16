import Database from 'better-sqlite3';
import crypto from 'crypto';
import path from 'path';
import type {
  AnalysisRecord,
  ContactMessage,
  DensityMetrics,
  GenderOption,
  HairCategory,
  UserProfile,
  UserRole,
} from '../src/types/hairlume';

const DB_PATH = path.resolve(process.cwd(), 'hairlume.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    gender TEXT NOT NULL DEFAULT 'Female',
    age INTEGER NOT NULL DEFAULT 25,
    hair_type TEXT NOT NULL DEFAULT 'Medium / Wavy',
    wash_frequency_days INTEGER NOT NULL DEFAULT 3,
    last_wash_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    image_data TEXT NOT NULL,
    gender_at_scan TEXT NOT NULL,
    age_at_scan INTEGER NOT NULL,
    scalp_notes TEXT NOT NULL DEFAULT '',
    primary_category TEXT NOT NULL,
    secondary_observations_json TEXT NOT NULL,
    confidence_score INTEGER NOT NULL,
    confidence_label TEXT NOT NULL,
    hair_health_score INTEGER NOT NULL,
    density_metrics_json TEXT NOT NULL,
    scalp_concerns_json TEXT NOT NULL,
    ai_summary TEXT NOT NULL,
    limitations_note TEXT NOT NULL,
    dermatologist_flag INTEGER NOT NULL DEFAULT 0,
    recommended_product_ids_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, keyHex] = stored.split(':');
  if (!salt || !keyHex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(keyHex, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

// Seed default demo member & admin accounts (no fake AI analyses are seeded)
function seedDefaultAccounts() {
  const checkStmt = db.prepare('SELECT id FROM users WHERE email = ?');

  if (!checkStmt.get('admin@hairlume.ai')) {
    db.prepare(
      `INSERT INTO users (name, email, password_hash, role, gender, age, hair_type, wash_frequency_days)
       VALUES (?, ?, ?, 'admin', 'Female', 30, 'Balanced', 3)`
    ).run('Dr. Meera Kapoor (Admin)', 'admin@hairlume.ai', hashPassword('Admin@1234'));
  }

  if (!checkStmt.get('demo@hairlume.ai')) {
    db.prepare(
      `INSERT INTO users (name, email, password_hash, role, gender, age, hair_type, wash_frequency_days)
       VALUES (?, ?, ?, 'user', 'Female', 24, 'Medium / Wavy', 3)`
    ).run('Ananya Sharma', 'demo@hairlume.ai', hashPassword('Demo@1234'));
  }
}

seedDefaultAccounts();

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  gender: string;
  age: number;
  hair_type: string;
  wash_frequency_days: number;
  last_wash_at: string | null;
  created_at: string;
}

function mapUserRow(row: UserRow): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as UserRole,
    gender: row.gender as GenderOption,
    age: row.age,
    hairType: row.hair_type,
    washFrequencyDays: row.wash_frequency_days,
    lastWashAt: row.last_wash_at,
    createdAt: row.created_at,
  };
}

interface AnalysisRow {
  id: number;
  user_id: number;
  image_data: string;
  gender_at_scan: string;
  age_at_scan: number;
  scalp_notes: string;
  primary_category: string;
  secondary_observations_json: string;
  confidence_score: number;
  confidence_label: string;
  hair_health_score: number;
  density_metrics_json: string;
  scalp_concerns_json: string;
  ai_summary: string;
  limitations_note: string;
  dermatologist_flag: number;
  recommended_product_ids_json: string;
  created_at: string;
}

function mapAnalysisRow(row: AnalysisRow): AnalysisRecord {
  return {
    id: row.id,
    userId: row.user_id,
    imageData: row.image_data,
    genderAtScan: row.gender_at_scan as GenderOption,
    ageAtScan: row.age_at_scan,
    scalpNotes: row.scalp_notes,
    primaryCategory: row.primary_category as HairCategory,
    secondaryObservations: JSON.parse(row.secondary_observations_json) as string[],
    confidenceScore: row.confidence_score,
    confidenceLabel: row.confidence_label,
    hairHealthScore: row.hair_health_score,
    densityMetrics: JSON.parse(row.density_metrics_json) as DensityMetrics,
    scalpConcerns: JSON.parse(row.scalp_concerns_json) as string[],
    aiSummary: row.ai_summary,
    limitationsNote: row.limitations_note,
    dermatologistFlag: row.dermatologist_flag === 1,
    recommendedProductIds: JSON.parse(row.recommended_product_ids_json) as string[],
    createdAt: row.created_at,
  };
}

export function createUser(params: {
  name: string;
  email: string;
  password: string;
  gender: GenderOption;
  age: number;
  hairType?: string;
}): UserProfile {
  const existing = db.prepare('SELECT id FROM users WHERE lower(email) = lower(?)').get(params.email);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }
  const result = db
    .prepare(
      `INSERT INTO users (name, email, password_hash, role, gender, age, hair_type)
       VALUES (?, ?, ?, 'user', ?, ?, ?)`
    )
    .run(
      params.name.trim(),
      params.email.trim().toLowerCase(),
      hashPassword(params.password),
      params.gender,
      params.age,
      params.hairType || 'Medium / Wavy'
    );
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as UserRow;
  return mapUserRow(row);
}

export function authenticateUser(email: string, password: string): UserProfile | null {
  const row = db
    .prepare('SELECT * FROM users WHERE lower(email) = lower(?)')
    .get(email.trim()) as UserRow | undefined;
  if (!row) return null;
  if (!verifyPassword(password, row.password_hash)) return null;
  return mapUserRow(row);
}

export function createSession(userId: number): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(
    token,
    userId,
    expiresAt
  );
  return token;
}

export function getUserBySessionToken(token: string): UserProfile | null {
  const session = db
    .prepare('SELECT user_id, expires_at FROM sessions WHERE token = ?')
    .get(token) as { user_id: number; expires_at: string } | undefined;
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }
  const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id) as UserRow | undefined;
  return userRow ? mapUserRow(userRow) : null;
}

export function deleteSession(token: string): void {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

export function updateUserProfile(
  userId: number,
  updates: {
    name?: string;
    gender?: GenderOption;
    age?: number;
    hairType?: string;
    washFrequencyDays?: number;
    lastWashAt?: string;
  }
): UserProfile {
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow | undefined;
  if (!existing) throw new Error('User not found.');

  db.prepare(
    `UPDATE users
     SET name = ?, gender = ?, age = ?, hair_type = ?, wash_frequency_days = ?, last_wash_at = ?
     WHERE id = ?`
  ).run(
    updates.name?.trim() || existing.name,
    updates.gender || existing.gender,
    typeof updates.age === 'number' ? updates.age : existing.age,
    updates.hairType?.trim() || existing.hair_type,
    typeof updates.washFrequencyDays === 'number'
      ? updates.washFrequencyDays
      : existing.wash_frequency_days,
    updates.lastWashAt !== undefined ? updates.lastWashAt : existing.last_wash_at,
    userId
  );

  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow;
  return mapUserRow(row);
}

export function updateUserPassword(userId: number, currentPassword: string, newPassword: string): void {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow | undefined;
  if (!row) throw new Error('User not found.');
  if (!verifyPassword(currentPassword, row.password_hash)) {
    throw new Error('Current password is incorrect.');
  }
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(newPassword), userId);
}

export function saveAnalysis(record: Omit<AnalysisRecord, 'id' | 'createdAt'>): AnalysisRecord {
  const result = db
    .prepare(
      `INSERT INTO analyses (
        user_id, image_data, gender_at_scan, age_at_scan, scalp_notes,
        primary_category, secondary_observations_json, confidence_score, confidence_label,
        hair_health_score, density_metrics_json, scalp_concerns_json,
        ai_summary, limitations_note, dermatologist_flag, recommended_product_ids_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      record.userId,
      record.imageData,
      record.genderAtScan,
      record.ageAtScan,
      record.scalpNotes,
      record.primaryCategory,
      JSON.stringify(record.secondaryObservations),
      record.confidenceScore,
      record.confidenceLabel,
      record.hairHealthScore,
      JSON.stringify(record.densityMetrics),
      JSON.stringify(record.scalpConcerns),
      record.aiSummary,
      record.limitationsNote,
      record.dermatologistFlag ? 1 : 0,
      JSON.stringify(record.recommendedProductIds)
    );

  const row = db.prepare('SELECT * FROM analyses WHERE id = ?').get(result.lastInsertRowid) as AnalysisRow;
  return mapAnalysisRow(row);
}

export function getAnalysesByUser(userId: number): AnalysisRecord[] {
  const rows = db
    .prepare('SELECT * FROM analyses WHERE user_id = ? ORDER BY datetime(created_at) DESC, id DESC')
    .all(userId) as AnalysisRow[];
  return rows.map(mapAnalysisRow);
}

export function getAnalysisById(analysisId: number, userId: number, isAdmin = false): AnalysisRecord | null {
  const row = isAdmin
    ? (db.prepare('SELECT * FROM analyses WHERE id = ?').get(analysisId) as AnalysisRow | undefined)
    : (db
        .prepare('SELECT * FROM analyses WHERE id = ? AND user_id = ?')
        .get(analysisId, userId) as AnalysisRow | undefined);
  return row ? mapAnalysisRow(row) : null;
}

export function deleteAnalysis(analysisId: number, userId: number, isAdmin = false): boolean {
  const result = isAdmin
    ? db.prepare('DELETE FROM analyses WHERE id = ?').run(analysisId)
    : db.prepare('DELETE FROM analyses WHERE id = ? AND user_id = ?').run(analysisId, userId);
  return result.changes > 0;
}

export function saveContactMessage(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): ContactMessage {
  const result = db
    .prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)')
    .run(params.name.trim(), params.email.trim(), params.subject.trim(), params.message.trim());
  return db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(result.lastInsertRowid) as ContactMessage;
}

export function getAdminOverview() {
  const users = db
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.gender, u.age, u.hair_type, u.wash_frequency_days, u.last_wash_at, u.created_at,
       (SELECT COUNT(*) FROM analyses a WHERE a.user_id = u.id) as analysisCount
       FROM users u ORDER BY u.id DESC`
    )
    .all() as Array<UserRow & { analysisCount: number }>;

  const analyses = db
    .prepare(
      `SELECT a.id, a.user_id, u.name as userName, u.email as userEmail, a.gender_at_scan, a.age_at_scan,
       a.primary_category, a.confidence_score, a.hair_health_score, a.dermatologist_flag, a.created_at
       FROM analyses a
       JOIN users u ON u.id = a.user_id
       ORDER BY a.id DESC LIMIT 50`
    )
    .all() as Array<{
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

  const categoryBreakdown = db
    .prepare(
      `SELECT primary_category as category, COUNT(*) as count
       FROM analyses
       GROUP BY primary_category
       ORDER BY count DESC`
    )
    .all() as Array<{ category: string; count: number }>;

  const messages = db
    .prepare('SELECT * FROM contact_messages ORDER BY id DESC LIMIT 50')
    .all() as Array<{
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
  }>;

  return {
    users: users.map((u) => ({
      ...mapUserRow(u),
      analysisCount: u.analysisCount,
    })),
    analyses,
    categoryBreakdown,
    messages: messages.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      status: m.status as 'open' | 'resolved',
      createdAt: m.created_at,
    })),
  };
}

export function deleteUserByAdmin(targetUserId: number): boolean {
  const row = db.prepare('SELECT role FROM users WHERE id = ?').get(targetUserId) as { role: string } | undefined;
  if (!row || row.role === 'admin') return false;
  const res = db.prepare('DELETE FROM users WHERE id = ?').run(targetUserId);
  return res.changes > 0;
}

export function updateContactStatus(messageId: number, status: 'open' | 'resolved'): boolean {
  const res = db.prepare('UPDATE contact_messages SET status = ? WHERE id = ?').run(status, messageId);
  return res.changes > 0;
}

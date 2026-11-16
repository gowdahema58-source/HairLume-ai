import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { CheckCircle2, ShieldAlert, Trash2 } from 'lucide-react';
import { ChartCanvas } from '../components/ChartCanvas';
import { EDUCATION_CONTENT } from '../data/catalog';
import { api } from '../lib/api';
import type { ContactMessage, GenderOption, UserProfile } from '../types/hairlume';

export function EducationPage() {
  const [activeTab, setActiveTab] = useState<'causes' | 'tips' | 'nutrition' | 'myths'>('causes');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-[#B76E79]">Evidence-Informed Hair Education</p>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2D123E]">
          Hair Health Knowledge Hub
        </h1>
        <p className="text-sm text-[#5E4B6E] max-w-2xl">
          Understand common drivers of shedding and breakage, gender-specific daily habits,
          essential micronutrients, and when professional dermatological care is warranted.
        </p>
      </div>

      {/* Segmented Control */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#F3EEF8] w-fit">
        {[
          { id: 'causes', label: 'Causes of Hair Fall' },
          { id: 'tips', label: 'Men & Women Tips' },
          { id: 'nutrition', label: 'Healthy Foods' },
          { id: 'myths', label: 'Myths vs. Facts' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-[#2D123E] shadow-sm'
                : 'text-[#5E4B6E] hover:text-[#2D123E]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'causes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EDUCATION_CONTENT.causes.map((item, idx) => (
            <div key={item.title} className="p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-2">
              <p className="font-mono text-xs text-[#B76E79] tabular-nums">0{idx + 1}</p>
              <h2 className="text-base font-semibold text-[#2D123E]">{item.title}</h2>
              <p className="text-sm text-[#4A3859] leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-4">
            <h2 className="font-editorial text-2xl font-semibold text-[#2D123E]">
              Hair Care Tips for Women
            </h2>
            <ul className="space-y-3 text-sm text-[#4A3859]">
              {EDUCATION_CONTENT.tipsByGender.women.map((tip) => (
                <li key={tip} className="pb-2.5 border-b border-[#3F1957]/10 leading-relaxed">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-4">
            <h2 className="font-editorial text-2xl font-semibold text-[#2D123E]">
              Hair Care Tips for Men
            </h2>
            <ul className="space-y-3 text-sm text-[#4A3859]">
              {EDUCATION_CONTENT.tipsByGender.men.map((tip) => (
                <li key={tip} className="pb-2.5 border-b border-[#3F1957]/10 leading-relaxed">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'nutrition' && (
        <div className="p-6 rounded-2xl bg-white border border-[#3F1957]/12 overflow-x-auto">
          <h2 className="font-editorial text-2xl font-semibold text-[#2D123E] mb-4">
            Hair-Supporting Nutrients &amp; Whole Foods
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#3F1957]/10 text-xs text-[#5E4B6E]">
                <th className="py-2.5 pr-4 font-semibold">Nutrient</th>
                <th className="py-2.5 pr-4 font-semibold">Recommended Foods</th>
                <th className="py-2.5 font-semibold">Biological Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3F1957]/8">
              {EDUCATION_CONTENT.foods.map((food) => (
                <tr key={food.nutrient}>
                  <td className="py-3 pr-4 font-semibold text-[#2D123E]">{food.nutrient}</td>
                  <td className="py-3 pr-4 text-[#4A3859]">{food.sources}</td>
                  <td className="py-3 text-[#5E4B6E]">{food.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'myths' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EDUCATION_CONTENT.myths.map((entry) => (
            <div key={entry.myth} className="p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-3">
              <div>
                <p className="text-xs font-semibold text-[#8C2D42]">Common Myth</p>
                <p className="text-sm font-semibold text-[#2D123E] mt-1">{entry.myth}</p>
              </div>
              <div className="pt-3 border-t border-[#3F1957]/10">
                <p className="text-xs font-semibold text-[#3F1957]">Evidence-Based Fact</p>
                <p className="text-sm text-[#4A3859] mt-1 leading-relaxed">{entry.fact}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* When to Consult a Dermatologist */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F9EBF0] border border-[#B76E79]/35 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6F1D31]">
          <ShieldAlert className="w-4 h-4" />
          Clinical Escalation Checklist
        </div>
        <h2 className="font-editorial text-2xl font-semibold text-[#2D123E]">
          When to Consult a Board-Certified Dermatologist
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#4A202B]">
          {EDUCATION_CONTENT.dermatologistCriteria.map((criterion) => (
            <li key={criterion} className="p-3.5 rounded-xl bg-white/85 border border-[#B76E79]/20">
              {criterion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface ProfilePageProps {
  user: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
}

export function ProfilePage({ user, onUserUpdated }: ProfilePageProps) {
  const [name, setName] = useState(user.name);
  const [gender, setGender] = useState<GenderOption>(user.gender);
  const [age, setAge] = useState<number>(user.age);
  const [hairType, setHairType] = useState(user.hairType);
  const [washFrequencyDays, setWashFrequencyDays] = useState<number>(user.washFrequencyDays);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileStatus(null);
    setProfileError(null);
    try {
      const res = await api.updateProfile({
        name,
        gender,
        age,
        hairType,
        washFrequencyDays,
      });
      onUserUpdated(res.user);
      setProfileStatus('Profile preferences saved to SQLite.');
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Unable to save profile.');
    }
  };

  const handleSavePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPwMessage(null);
    setPwError(null);
    try {
      await api.updatePassword({ currentPassword, newPassword });
      setPwMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Password update failed.');
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-1">
        <p className="text-xs font-medium text-[#B76E79]">Account &amp; Care Preferences</p>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2D123E]">
          Profile Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleSaveProfile}
          className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-4"
        >
          <h2 className="font-editorial text-2xl font-semibold text-[#2D123E]">
            Personal Details
          </h2>

          {profileStatus && (
            <div className="p-3 rounded-lg bg-[#F3EEF8] text-xs font-semibold text-[#3F1957] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {profileStatus}
            </div>
          )}
          {profileError && (
            <div className="p-3 rounded-lg bg-[#F9EBF0] text-xs font-semibold text-[#8C2D42]">
              {profileError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderOption)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm bg-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">Age</label>
              <input
                type="number"
                min={13}
                max={100}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm font-mono tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">Hair Type</label>
              <select
                value={hairType}
                onChange={(e) => setHairType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm bg-white"
              >
                <option value="Fine / Straight">Fine / Straight</option>
                <option value="Medium / Wavy">Medium / Wavy</option>
                <option value="Thick / Curly">Thick / Curly</option>
                <option value="Coily / Textured">Coily / Textured</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">
                Wash Reminder (Days)
              </label>
              <input
                type="number"
                min={1}
                max={14}
                value={washFrequencyDays}
                onChange={(e) => setWashFrequencyDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm font-mono tabular-nums"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#3F1957] text-white text-sm font-semibold hover:bg-[#2D123E] cursor-pointer"
          >
            Save Profile Changes
          </button>
        </form>

        <form
          onSubmit={handleSavePassword}
          className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-4 self-start"
        >
          <h2 className="font-editorial text-2xl font-semibold text-[#2D123E]">
            Security &amp; Password
          </h2>
          {pwMessage && (
            <div className="p-3 rounded-lg bg-[#F3EEF8] text-xs font-semibold text-[#3F1957]">
              {pwMessage}
            </div>
          )}
          {pwError && (
            <div className="p-3 rounded-lg bg-[#F9EBF0] text-xs font-semibold text-[#8C2D42]">
              {pwError}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg border border-[#3F1957]/20 text-[#2D123E] text-sm font-semibold hover:bg-[#F3EEF8] cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminDashboardPage({ user }: { user: UserProfile }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
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
  } | null>(null);

  const loadAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAdminOverview();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role === 'admin') {
      void loadAdmin();
    }
  }, [user.role]);

  const chartConfig = useMemo(() => {
    if (!data || data.categoryBreakdown.length === 0) return null;
    return {
      type: 'bar' as const,
      data: {
        labels: data.categoryBreakdown.map((c) => c.category),
        datasets: [
          {
            label: 'Analyses Count',
            data: data.categoryBreakdown.map((c) => c.count),
            backgroundColor: '#3F1957',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    };
  }, [data]);

  if (user.role !== 'admin') {
    return (
      <div className="p-8 rounded-2xl bg-white border border-[#3F1957]/12 text-center space-y-2">
        <h1 className="font-editorial text-2xl font-semibold text-[#2D123E]">
          Administrator Access Required
        </h1>
        <p className="text-sm text-[#5E4B6E]">
          Sign in with an administrator account to access system metrics and user management.
        </p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-sm text-[#5E4B6E]">Loading admin overview...</p>;
  }

  if (error || !data) {
    return (
      <div className="p-4 rounded-xl bg-[#F9EBF0] text-sm text-[#8C2D42]">
        {error || 'Failed to load admin console.'}
      </div>
    );
  }

  const openMessages = data.messages.filter((m) => m.status === 'open').length;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <p className="text-xs font-medium text-[#B76E79]">System Administration</p>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2D123E]">
          Admin Dashboard
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#3F1957]/10">
          <p className="text-xs text-[#5E4B6E]">Registered Accounts</p>
          <p className="font-mono text-2xl font-medium text-[#2D123E] tabular-nums mt-1">
            {data.users.length}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[#3F1957]/10">
          <p className="text-xs text-[#5E4B6E]">Total AI Analyses</p>
          <p className="font-mono text-2xl font-medium text-[#3F1957] tabular-nums mt-1">
            {data.analyses.length}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[#3F1957]/10">
          <p className="text-xs text-[#5E4B6E]">Top Category</p>
          <p className="text-sm font-semibold text-[#2D123E] mt-1 truncate">
            {data.categoryBreakdown[0]?.category || 'No scans yet'}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-white border border-[#3F1957]/10">
          <p className="text-xs text-[#5E4B6E]">Open Support Inquiries</p>
          <p className="font-mono text-2xl font-medium text-[#B76E79] tabular-nums mt-1">
            {openMessages}
          </p>
        </div>
      </div>

      {chartConfig && (
        <div className="p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-4">
          <h2 className="font-editorial text-2xl font-semibold text-[#2D123E]">
            Detected Category Distribution
          </h2>
          <ChartCanvas
            config={chartConfig}
            heightClass="h-64"
            ariaLabel="Platform hair condition category distribution"
          />
        </div>
      )}

      {/* Registered Users Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-4 overflow-x-auto">
        <h2 className="font-editorial text-2xl font-semibold text-[#2D123E]">
          Registered Users
        </h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#3F1957]/10 text-xs text-[#5E4B6E]">
              <th className="py-2 pr-4 font-semibold">Name</th>
              <th className="py-2 pr-4 font-semibold">Email</th>
              <th className="py-2 pr-4 font-semibold">Profile</th>
              <th className="py-2 pr-4 font-semibold text-right">Scans</th>
              <th className="py-2 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3F1957]/8">
            {data.users.map((u) => (
              <tr key={u.id}>
                <td className="py-3 pr-4 font-medium text-[#2D123E]">
                  {u.name} {u.role === 'admin' ? '(Admin)' : ''}
                </td>
                <td className="py-3 pr-4 text-xs text-[#5E4B6E]">{u.email}</td>
                <td className="py-3 pr-4 text-xs text-[#4A3859]">
                  {u.gender} · Age {u.age}
                </td>
                <td className="py-3 pr-4 text-right font-mono tabular-nums">{u.analysisCount}</td>
                <td className="py-3 text-right">
                  {u.role !== 'admin' && (
                    <button
                      type="button"
                      onClick={async () => {
                        await api.deleteAdminUser(u.id);
                        await loadAdmin();
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C2D42] hover:underline cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contact Messages Inbox */}
      <div className="p-6 rounded-2xl bg-white border border-[#3F1957]/12 space-y-4">
        <h2 className="font-editorial text-2xl font-semibold text-[#2D123E]">
          Contact Inquiries Inbox
        </h2>
        {data.messages.length === 0 ? (
          <p className="text-sm text-[#5E4B6E]">No contact inquiries received yet.</p>
        ) : (
          <div className="divide-y divide-[#3F1957]/10">
            {data.messages.map((msg) => (
              <div
                key={msg.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <p className="text-xs text-[#5E4B6E]">
                    {msg.name} ({msg.email}) · {new Date(msg.createdAt).toLocaleDateString()} ·{' '}
                    <span className="font-semibold text-[#3F1957]">{msg.status}</span>
                  </p>
                  <p className="text-sm font-semibold text-[#2D123E]">{msg.subject}</p>
                  <p className="text-xs text-[#4A3859]">{msg.message}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await api.updateAdminMessageStatus(
                      msg.id,
                      msg.status === 'open' ? 'resolved' : 'open'
                    );
                    await loadAdmin();
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-[#3F1957]/20 text-xs font-semibold text-[#2D123E] hover:bg-[#F3EEF8] shrink-0 cursor-pointer self-start sm:self-center"
                >
                  {msg.status === 'open' ? 'Mark Resolved' : 'Reopen'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import { BRAND_LOGO_PATH } from '../data/catalog';
import { api, setStoredToken } from '../lib/api';
import type { AppRoute, GenderOption, UserProfile } from '../types/hairlume';

interface AuthPageProps {
  onSuccess: (user: UserProfile) => void;
  onNavigate: (route: AppRoute) => void;
}

export function LoginPage({ onSuccess, onNavigate }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setStoredToken(res.token);
      onSuccess(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="p-8 rounded-2xl bg-white border border-[#3F1957]/12 space-y-6">
        <div className="space-y-2 text-center">
          <img
            src={BRAND_LOGO_PATH}
            alt="HAIRLUME AI"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-xl mx-auto object-cover border border-[#B76E79]/30"
          />
          <h1 className="font-editorial text-3xl font-semibold text-[#2D123E]">Welcome Back</h1>
          <p className="text-sm text-[#5E4B6E]">
            Sign in to access hair analysis, product matches, and scan history.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#F9EBF0] text-xs font-medium text-[#8C2D42]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm focus:outline-2 focus:outline-[#3F1957]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm focus:outline-2 focus:outline-[#3F1957]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#3F1957] text-white text-sm font-semibold hover:bg-[#2D123E] disabled:opacity-60 transition-colors cursor-pointer"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-4 border-t border-[#3F1957]/10 space-y-2">
          <p className="text-xs text-[#5E4B6E] text-center">Quick Demo Credentials</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('demo@hairlume.ai', 'Demo@1234')}
              className="px-3 py-2 rounded-lg bg-[#F3EEF8] text-xs font-semibold text-[#3F1957] hover:bg-[#E6DDF0] transition-colors cursor-pointer"
            >
              Demo Member
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@hairlume.ai', 'Admin@1234')}
              className="px-3 py-2 rounded-lg bg-[#F3EEF8] text-xs font-semibold text-[#3F1957] hover:bg-[#E6DDF0] transition-colors cursor-pointer"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <p className="text-xs text-center text-[#5E4B6E]">
          New to HAIRLUME AI?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="font-semibold text-[#3F1957] hover:underline cursor-pointer"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}

export function RegisterPage({ onSuccess, onNavigate }: AuthPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<GenderOption>('Female');
  const [age, setAge] = useState<number>(25);
  const [hairType, setHairType] = useState('Medium / Wavy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.register({ name, email, password, gender, age, hairType });
      setStoredToken(res.token);
      onSuccess(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 sm:py-14">
      <div className="p-8 rounded-2xl bg-white border border-[#3F1957]/12 space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="font-editorial text-3xl font-semibold text-[#2D123E]">
            Create Your Profile
          </h1>
          <p className="text-sm text-[#5E4B6E]">
            Personalize your hair analysis profile with gender and age context.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#F9EBF0] text-xs font-medium text-[#8C2D42]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Riya Verma"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm focus:outline-2 focus:outline-[#3F1957]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm focus:outline-2 focus:outline-[#3F1957]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm focus:outline-2 focus:outline-[#3F1957]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">Gender</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-[#F3EEF8]">
                {(['Female', 'Male', 'Other'] as GenderOption[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGender(opt)}
                    className={`py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      gender === opt
                        ? 'bg-[#3F1957] text-white'
                        : 'text-[#4A3859] hover:text-[#2D123E]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">
                Age ({age} years)
              </label>
              <input
                type="number"
                min={13}
                max={100}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm font-mono tabular-nums focus:outline-2 focus:outline-[#3F1957]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D123E] mb-1.5">
              Natural Hair Texture
            </label>
            <select
              value={hairType}
              onChange={(e) => setHairType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 text-sm bg-white focus:outline-2 focus:outline-[#3F1957]"
            >
              <option value="Fine / Straight">Fine / Straight</option>
              <option value="Medium / Wavy">Medium / Wavy</option>
              <option value="Thick / Curly">Thick / Curly</option>
              <option value="Coily / Textured">Coily / Textured</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#3F1957] text-white text-sm font-semibold hover:bg-[#2D123E] disabled:opacity-60 transition-colors cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Register & Continue'}
          </button>
        </form>

        <p className="text-xs text-center text-[#5E4B6E]">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-semibold text-[#3F1957] hover:underline cursor-pointer"
          >
            Sign in instead
          </button>
        </p>
      </div>
    </div>
  );
}

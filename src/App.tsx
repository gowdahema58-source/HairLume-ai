import { useCallback, useEffect, useState } from 'react';
import { PublicLayout, WorkspaceLayout } from './components/LayoutShell';
import { api, getStoredToken, setStoredToken } from './lib/api';
import {
  AnalyzingPage,
  ResultsPage,
  UploadCapturePage,
  type PendingScanPayload,
} from './pages/AnalysisFlowPages';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { AdminDashboardPage, EducationPage, ProfilePage } from './pages/ProfileEduAdminPages';
import { HomePage, IntroSplashPage } from './pages/PublicPages';
import {
  HistoryPage,
  ProductsPage,
} from './pages/WorkspacePages';
import type { AnalysisRecord, AppRoute, UserProfile } from './types/hairlume';

const ROUTE_TITLES: Record<AppRoute, string> = {
  intro: 'Intro',
  home: 'Home',
  login: 'Sign In',
  register: 'Register',
  upload: 'Hair Image Upload',
  analyze: 'AI Hair Analysis',
  results: 'Detection Results',
  products: 'Product Recommendations',
  history: 'Analysis History',
  education: 'Education Hub',
  profile: 'Profile Settings',
  admin: 'Admin Dashboard',
};

function parseRouteFromHash(): AppRoute {
  const raw = window.location.hash.replace(/^#\/?/, '').trim() as AppRoute;
  if (raw && raw in ROUTE_TITLES) {
    return raw;
  }
  return 'intro';
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => parseRouteFromHash());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisRecord | null>(null);
  const [pendingScan, setPendingScan] = useState<PendingScanPayload | null>(null);

  const navigate = useCallback((nextRoute: AppRoute) => {
    setRoute(nextRoute);
    window.location.hash = `#/${nextRoute}`;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseRouteFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const loadUserWorkspaceData = useCallback(async () => {
    try {
      const analysesRes = await api.listAnalyses();
      setAnalyses(analysesRes.analyses);
      setSelectedAnalysis((prev) => prev || analysesRes.analyses[0] || null);
    } catch {
      // Ignore transient errors during background hydration
    }
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setAuthReady(true);
      return;
    }
    api
      .me()
      .then(async (res) => {
        setUser(res.user);
        await loadUserWorkspaceData();
      })
      .catch(() => {
        setStoredToken(null);
        setUser(null);
      })
      .finally(() => {
        setAuthReady(true);
      });
  }, [loadUserWorkspaceData]);

  // Show Intro first, then require login or registration before accessing the website
  useEffect(() => {
    if (!authReady) return;
    if (!user && route !== 'intro' && route !== 'login' && route !== 'register') {
      navigate('intro');
    } else if (user && (route === 'login' || route === 'register')) {
      navigate(user.role === 'admin' ? 'admin' : 'home');
    }
  }, [authReady, user, route, navigate]);

  const handleAuthSuccess = async (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    await loadUserWorkspaceData();
    navigate(authenticatedUser.role === 'admin' ? 'admin' : 'home');
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Proceed with local sign-out even if server token already expired
    }
    setStoredToken(null);
    setUser(null);
    setAnalyses([]);
    setSelectedAnalysis(null);
    navigate('intro');
  };

  const handleAnalysisComplete = useCallback(
    (created: AnalysisRecord) => {
      setAnalyses((prev) => [created, ...prev]);
      setSelectedAnalysis(created);
      setPendingScan(null);
      navigate('results');
    },
    [navigate]
  );

  const handleDeleteAnalysis = async (id: number) => {
    await api.deleteAnalysis(id);
    setAnalyses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(next[0] || null);
      }
      return next;
    });
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#FAF8FC] flex items-center justify-center">
        <p className="font-editorial text-2xl text-[#2D123E]">HAIRLUME AI</p>
      </div>
    );
  }

  // Unauthenticated gate: Intro page first, then only Login or Register
  if (!user) {
    if (route === 'login' || route === 'register') {
      return (
        <PublicLayout route={route} user={null} onNavigate={navigate}>
          {route === 'register' ? (
            <RegisterPage onSuccess={handleAuthSuccess} onNavigate={navigate} />
          ) : (
            <LoginPage onSuccess={handleAuthSuccess} onNavigate={navigate} />
          )}
        </PublicLayout>
      );
    }
    return <IntroSplashPage user={null} onNavigate={navigate} />;
  }

  if (route === 'intro') {
    return <IntroSplashPage user={user} onNavigate={navigate} />;
  }

  return (
    <WorkspaceLayout
      route={route}
      user={user}
      breadcrumbTitle={ROUTE_TITLES[route]}
      onNavigate={navigate}
      onLogout={handleLogout}
    >
      {route === 'home' && <HomePage user={user} onNavigate={navigate} />}
      {route === 'upload' && (
        <UploadCapturePage
          user={user}
          onStartAnalyze={(payload) => {
            setPendingScan(payload);
            navigate('analyze');
          }}
        />
      )}
      {route === 'analyze' && (
        <AnalyzingPage
          payload={pendingScan}
          onComplete={handleAnalysisComplete}
          onBackToUpload={() => navigate('upload')}
        />
      )}
      {route === 'results' && (
        <ResultsPage analysis={selectedAnalysis || analyses[0] || null} onNavigate={navigate} />
      )}
      {route === 'products' && <ProductsPage latestAnalysis={analyses[0] || null} />}
      {route === 'history' && (
        <HistoryPage
          analyses={analyses}
          onSelectAnalysis={(a) => setSelectedAnalysis(a)}
          onDeleteAnalysis={handleDeleteAnalysis}
          onNavigate={navigate}
        />
      )}
      {route === 'education' && <EducationPage />}
      {route === 'profile' && <ProfilePage user={user} onUserUpdated={setUser} />}
      {route === 'admin' && <AdminDashboardPage user={user} />}
    </WorkspaceLayout>
  );
}

import { ArrowRight, ShieldAlert } from 'lucide-react';
import {
  BRAND_LOGO_PATH,
  CLINICALLY_PROVEN_GUIDANCE,
  HERO_EDITORIAL_IMAGE,
  PRODUCT_CATALOG,
} from '../data/catalog';
import type { AppRoute, UserProfile } from '../types/hairlume';

interface PublicPageProps {
  user: UserProfile | null;
  onNavigate: (route: AppRoute) => void;
}

export function IntroSplashPage({ user, onNavigate }: PublicPageProps) {
  const nextDefaultRoute: AppRoute = user ? (user.role === 'admin' ? 'admin' : 'home') : 'login';

  return (
    <div className="min-h-screen bg-[#2D123E] text-white flex flex-col justify-between p-6 sm:p-12">
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <span className="font-editorial text-lg tracking-wide text-[#F9EBF0]">HAIRLUME AI</span>
        <button
          type="button"
          onClick={() => onNavigate(nextDefaultRoute)}
          className="text-xs font-medium text-[#E6DDF0] hover:text-white underline underline-offset-4 cursor-pointer"
        >
          {user ? 'Skip Intro' : 'Sign In'}
        </button>
      </div>

      <div className="max-w-2xl mx-auto text-center py-10 space-y-8">
        <div className="mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border border-[#C98690]/45 bg-[#1F122B] shadow-2xl">
          <img
            src={BRAND_LOGO_PATH}
            alt="HAIRLUME AI brand logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3">
          {user && (
            <p className="text-sm font-medium text-[#F9EBF0]/90">
              Welcome, {user.name}
            </p>
          )}
          <p className="text-xs font-medium tracking-[0.22em] text-[#C98690]">
            DISCOVER · DETECT · REVIVE
          </p>
          <h1
            className="font-editorial text-4xl sm:text-6xl font-semibold tracking-tight text-white"
            style={{ textWrap: 'balance' }}
          >
            HAIRLUME AI
          </h1>
          <p className="text-base sm:text-lg text-[#E6DDF0]/90 max-w-xl mx-auto leading-relaxed">
            AI-powered hair fall detection, visible scalp assessment, and personalized hair care
            recommendations built for clarity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => onNavigate(nextDefaultRoute)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[#B76E79] text-white text-sm font-semibold hover:bg-[#C98690] transition-colors cursor-pointer"
          >
            {user ? 'Enter Platform' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate(user ? 'upload' : 'register')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-lg border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
          >
            {user ? 'Start Hair Scan' : 'Create Account'}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center text-xs text-[#E6DDF0]/70">
        Visual hair assessments are cosmetic and informational only. Photographs alone cannot
        diagnose medical scalp or follicle disorders.
      </div>
    </div>
  );
}

export function HomePage({ user, onNavigate }: PublicPageProps) {
  const featuredProducts = [
    PRODUCT_CATALOG.find((p) => p.category === 'Shampoo')!,
    PRODUCT_CATALOG.find((p) => p.category === 'Conditioner')!,
    PRODUCT_CATALOG.find((p) => p.category === 'Hair Serum')!,
    PRODUCT_CATALOG.find((p) => p.category === 'Hair Oil')!,
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Profile & Gender Context',
      desc: 'Register with age, gender, and hair characteristics to contextualize AI visual guidance.',
    },
    {
      num: '02',
      title: 'Upload or Camera Capture',
      desc: 'Submit a well-lit crown, hairline, or parting photo using file upload or live camera.',
    },
    {
      num: '03',
      title: 'AI Visual Inspection',
      desc: 'Gemini Vision evaluates visible density patterns, flaking, oil sheen, and breakage.',
    },
    {
      num: '04',
      title: 'Products & Scan History',
      desc: 'Receive matched cosmetic formulas and revisit saved hair assessment reports anytime.',
    },
  ];

  return (
    <div className="space-y-20 pb-8">
      {/* Hero Split */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 py-2">
            <p className="text-xs font-medium tracking-[0.18em] text-[#B76E79]">
              DISCOVER · DETECT · REVIVE
            </p>
            <h1
              className="font-editorial font-semibold text-[#2D123E] leading-[1.08] tracking-tight"
              style={{ fontSize: 'clamp(2.35rem, 4.2vw, 3.75rem)', textWrap: 'balance' }}
            >
              Intelligent Hair Health &amp; Scalp Visual Analysis
            </h1>
            <p className="text-base text-[#4A3859] leading-relaxed max-w-xl">
              HAIRLUME AI analyzes uploaded or camera-captured hair photographs to highlight visible
              thinning patterns, scalp surface cues, and strand breakage—translating findings into
              personalized product selections and clear visual reports.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate(user ? 'upload' : 'register')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#3F1957] text-white text-sm font-semibold hover:bg-[#2D123E] transition-colors cursor-pointer"
              >
                Start Hair Analysis
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="inline-flex items-center px-5 py-3.5 rounded-lg border border-[#3F1957]/20 text-[#2D123E] text-sm font-semibold hover:bg-[#F3EEF8] transition-colors cursor-pointer"
              >
                Explore Products
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-72 sm:h-96 lg:h-full min-h-[360px] rounded-2xl overflow-hidden border border-[#3F1957]/12 bg-[#2D123E]">
              <img
                src={HERO_EDITORIAL_IMAGE}
                alt="Healthy glossy hair editorial portrait"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* 4-Column Summary Strip Below Hero */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 border-y border-[#3F1957]/10 py-6">
          <div>
            <p className="font-mono text-2xl font-medium text-[#3F1957] tabular-nums">8</p>
            <p className="text-xs font-medium text-[#5E4B6E] mt-1">Visible Hair &amp; Scalp Categories</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-[#3F1957] tabular-nums">14</p>
            <p className="text-xs font-medium text-[#5E4B6E] mt-1">Curated Commercial Formulas</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-[#3F1957] tabular-nums">Live</p>
            <p className="text-xs font-medium text-[#5E4B6E] mt-1">Vision Validation &amp; Confidence</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-[#3F1957] tabular-nums">100%</p>
            <p className="text-xs font-medium text-[#5E4B6E] mt-1">Transparent Non-Diagnostic Ethics</p>
          </div>
        </div>
      </section>

      {/* Section 01: Workflow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-[#B76E79]">Structured Assessment Flow</p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2D123E]">
              From Photograph to Personalized Care Plan
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('education')}
            className="text-sm font-semibold text-[#3F1957] hover:underline underline-offset-4 cursor-pointer self-start sm:self-auto"
          >
            Read Hair Science Guide
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-xl bg-white border border-[#3F1957]/10 space-y-3"
            >
              <p className="font-mono text-xs font-medium text-[#B76E79] tabular-nums">{step.num}</p>
              <h3 className="text-base font-semibold text-[#2D123E]">{step.title}</h3>
              <p className="text-sm text-[#5E4B6E] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 02: Curated Product Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-[#B76E79]">Matched Formulations</p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2D123E]">
              Shampoos, Conditioners, Serums &amp; Oils
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3F1957] hover:underline underline-offset-4 cursor-pointer self-start sm:self-auto"
          >
            View All 14 Products
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-xl bg-white border border-[#3F1957]/10 overflow-hidden flex flex-col"
            >
              <div
                className={`aspect-[4/3] overflow-hidden ${
                  product.image.startsWith('/assets/aistudio/') ? 'bg-white p-3' : 'bg-[#F3EEF8]'
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full ${
                    product.image.startsWith('/assets/aistudio/') ? 'object-contain' : 'object-cover'
                  }`}
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <p className="text-xs text-[#5E4B6E]">
                    {product.brand} <span aria-hidden="true">·</span> {product.category}
                  </p>
                  <h3 className="text-sm font-semibold text-[#2D123E] leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#5E4B6E] line-clamp-2">{product.description}</p>
                </div>
                <div className="pt-2 border-t border-[#3F1957]/10 flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-[#2D123E] tabular-nums">
                    ₹{product.priceInr}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('products')}
                    className="text-xs font-semibold text-[#3F1957] hover:underline cursor-pointer"
                  >
                    Usage Guide
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 03: Scientific Transparency & Cosmetic vs Clinical */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-[#F3EEF8] border border-[#3F1957]/12 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#3F1957]">
              <ShieldAlert className="w-4 h-4 text-[#B76E79]" />
              Clinical Transparency &amp; Limitations
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#2D123E]">
              Honest Visual Screening, Not Medical Diagnosis
            </h2>
            <p className="text-sm text-[#4A3859] leading-relaxed">
              An image alone cannot diagnose alopecia areata, hormonal imbalances, thyroid
              dysfunction, or fungal scalp infections. HAIRLUME AI evaluates visible density,
              parting contrast, oiliness, and flaking cues—and clearly separates cosmetic care
              from clinically proven treatments.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CLINICALLY_PROVEN_GUIDANCE.map((item) => (
              <div key={item.title} className="p-4 rounded-xl bg-white border border-[#3F1957]/10 space-y-2">
                <p className="text-xs font-medium text-[#B76E79]">{item.category}</p>
                <h3 className="text-sm font-semibold text-[#2D123E]">{item.title}</h3>
                <p className="text-xs text-[#5E4B6E] leading-relaxed">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

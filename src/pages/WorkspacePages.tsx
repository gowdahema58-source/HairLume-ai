import { useMemo, useState } from 'react';
import {
  Eye,
  Info,
  Search,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import {
  CLINICALLY_PROVEN_GUIDANCE,
  PRODUCT_CATALOG,
} from '../data/catalog';
import {
  HAIR_CATEGORIES,
  type AnalysisRecord,
  type AppRoute,
  type ProductCategory,
  type ProductItem,
} from '../types/hairlume';

interface ProductsPageProps {
  latestAnalysis: AnalysisRecord | null;
}

export function ProductsPage({ latestAnalysis }: ProductsPageProps) {
  const [categoryFilter, setCategoryFilter] = useState<'All' | ProductCategory>('All');
  const [matchOnly, setMatchOnly] = useState<boolean>(Boolean(latestAnalysis));
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCT_CATALOG.filter((p) => {
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (matchOnly && latestAnalysis && !p.bestFor.includes(latestAnalysis.primaryCategory)) {
        return false;
      }
      return true;
    });
  }, [categoryFilter, matchOnly, latestAnalysis]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#B76E79]">
            {latestAnalysis
              ? `Tailored for: ${latestAnalysis.primaryCategory}`
              : 'Complete Commercial Hair Care Catalog'}
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2D123E]">
            Personalized Product Recommendations
          </h1>
        </div>

        {latestAnalysis && (
          <button
            type="button"
            onClick={() => setMatchOnly((v) => !v)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer self-start md:self-auto ${
              matchOnly
                ? 'bg-[#3F1957] text-white border-[#3F1957]'
                : 'bg-white text-[#2D123E] border-[#3F1957]/20 hover:bg-[#F3EEF8]'
            }`}
          >
            {matchOnly ? 'Showing Matched to Latest Scan' : 'Show Only Matched to Scan'}
          </button>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#F3EEF8] w-fit">
        {(['All', 'Shampoo', 'Conditioner', 'Hair Serum', 'Hair Oil'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              categoryFilter === cat
                ? 'bg-white text-[#2D123E] shadow-sm'
                : 'text-[#5E4B6E] hover:text-[#2D123E]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cosmetic vs Clinical Notice */}
      <div className="p-5 rounded-xl bg-[#F9EBF0] border border-[#B76E79]/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#8C2D42] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#4A202B] space-y-1">
          <p className="font-semibold">
            Cosmetic Care vs. Clinically Proven Medical Treatments
          </p>
          <p>
            All 14 shampoos, conditioners, serums, and oils listed below are{' '}
            <strong>cosmetic hair-care formulations</strong> designed to cleanse, soften, protect
            cuticles, and reduce mechanical breakage. They do not replace clinically proven
            dermatological medications (such as topical Minoxidil, oral Finasteride, or Ketoconazole
            2%) when treating medical hair loss or scalp disorders.
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl bg-white border border-[#3F1957]/12 overflow-hidden flex flex-col"
          >
            <div
              className={`aspect-[4/3] overflow-hidden ${
                product.image.startsWith('/assets/aistudio/') ? 'bg-white p-4' : 'bg-[#F3EEF8]'
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

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-[#5E4B6E]">
                  {product.brand} <span aria-hidden="true">·</span> {product.category}{' '}
                  <span aria-hidden="true">·</span> {product.size}
                </p>
                <h2 className="text-base font-semibold text-[#2D123E] leading-snug">
                  {product.name}
                </h2>
                <p className="text-xs text-[#4A3859] leading-relaxed">{product.description}</p>
                <p className="text-xs text-[#5E4B6E]">
                  <strong className="text-[#2D123E]">Role:</strong> {product.cosmeticRole}
                </p>
              </div>

              <div className="pt-3 border-t border-[#3F1957]/10 flex items-center justify-between">
                <div>
                  <p className="font-mono text-base font-semibold text-[#3F1957] tabular-nums">
                    ₹{product.priceInr}
                  </p>
                  <p className="text-[11px] text-[#5E4B6E]">{product.classification}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className="px-4 py-2 rounded-lg bg-[#F3EEF8] text-[#3F1957] text-xs font-semibold hover:bg-[#E6DDF0] transition-colors cursor-pointer"
                >
                  Usage &amp; Actives
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clinically Proven Reference Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#3F1957]/12 space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#3F1957]">
          <ShieldAlert className="w-4 h-4 text-[#B76E79]" />
          Dermatologist-Prescribed Clinical Reference
        </div>
        <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#2D123E]">
          When Cosmetic Care Isn&apos;t Enough: Clinically Proven Treatments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CLINICALLY_PROVEN_GUIDANCE.map((item) => (
            <div key={item.title} className="p-4 rounded-xl bg-[#FAF8FC] border border-[#3F1957]/10 space-y-2">
              <p className="text-xs font-medium text-[#B76E79]">{item.category}</p>
              <h3 className="text-sm font-semibold text-[#2D123E]">{item.title}</h3>
              <p className="text-xs text-[#5E4B6E] leading-relaxed">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Instructions Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-2xl bg-white border border-[#3F1957]/15 p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-[#B76E79] font-medium">
                  {selectedProduct.brand} · {selectedProduct.category} · {selectedProduct.classification}
                </p>
                <h3 className="font-editorial text-2xl font-semibold text-[#2D123E] mt-1">
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-3 py-1 rounded-md border border-[#3F1957]/20 text-xs font-semibold text-[#2D123E] cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm text-[#4A3859]">
              <div>
                <p className="text-xs font-semibold text-[#2D123E] mb-1">Key Actives</p>
                <p className="text-xs">{selectedProduct.keyActives.join(' · ')}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2D123E] mb-1">How to Apply</p>
                <p className="text-sm leading-relaxed">{selectedProduct.usageInstructions}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2D123E] mb-1">Best Matched Categories</p>
                <p className="text-xs">{selectedProduct.bestFor.join(' · ')}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#3F1957]/10 flex items-center justify-between">
              <span className="font-mono text-base font-semibold text-[#3F1957] tabular-nums">
                ₹{selectedProduct.priceInr} ({selectedProduct.size})
              </span>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-5 py-2 rounded-lg bg-[#3F1957] text-white text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface HistoryPageProps {
  analyses: AnalysisRecord[];
  onSelectAnalysis: (analysis: AnalysisRecord) => void;
  onDeleteAnalysis: (id: number) => Promise<void>;
  onNavigate: (route: AppRoute) => void;
}

export function HistoryPage({
  analyses,
  onSelectAnalysis,
  onDeleteAnalysis,
  onNavigate,
}: HistoryPageProps) {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return analyses.filter((a) => {
      if (categoryFilter !== 'All' && a.primaryCategory !== categoryFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          a.primaryCategory.toLowerCase().includes(q) ||
          a.aiSummary.toLowerCase().includes(q) ||
          a.scalpNotes.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [analyses, categoryFilter, query]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await onDeleteAnalysis(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#B76E79]">SQLite Scan Archive</p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#2D123E]">
            Analysis History
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('upload')}
          className="px-4 py-2 rounded-lg bg-[#3F1957] text-white text-xs font-semibold cursor-pointer self-start sm:self-auto"
        >
          New Scan
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#5E4B6E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by classification or notes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#3F1957]/20 bg-white text-sm focus:outline-2 focus:outline-[#3F1957]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by hair category"
          className="px-3.5 py-2.5 rounded-lg border border-[#3F1957]/20 bg-white text-sm"
        >
          <option value="All">All 8 Categories</option>
          {HAIR_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-[#3F1957]/12 text-center space-y-3">
          <p className="text-sm font-medium text-[#2D123E]">No matching analyses found</p>
          <p className="text-xs text-[#5E4B6E]">
            {analyses.length === 0
              ? 'Upload your first hair photograph to build a personal analysis timeline.'
              : 'Try adjusting your search or category filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-[#3F1957]/12 flex gap-4 items-start"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#1F122B] shrink-0">
                <img
                  src={item.imageData}
                  alt={`Scan ${item.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <p className="text-xs text-[#5E4B6E] font-mono tabular-nums">
                  #{item.id} · {new Date(item.createdAt).toLocaleDateString()} · Confidence{' '}
                  {item.confidenceScore}%
                </p>
                <h2 className="text-base font-semibold text-[#2D123E] truncate">
                  {item.primaryCategory}
                </h2>
                <p className="text-xs text-[#4A3859] line-clamp-2">{item.aiSummary}</p>

                <div className="pt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectAnalysis(item);
                      onNavigate('results');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F1957] hover:underline cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Report
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === item.id}
                    onClick={() => void handleDelete(item.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C2D42] hover:underline cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {deletingId === item.id ? 'Removing...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

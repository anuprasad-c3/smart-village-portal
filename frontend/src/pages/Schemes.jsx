import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { ArrowDown, HandCoins, Search, ShieldCheck } from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import SchemeCard from "../components/schemes/SchemeCard";
import SchemeFilters from "../components/schemes/SchemeFilters";
import Pagination from "../components/ui/Pagination";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { schemeService } from "../services/schemeService";
import { useLanguage } from "../context/LanguageContext";

function Schemes() {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Active");
  const [page, setPage] = useState(1);

  const fetchSchemes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await schemeService.getAll({
        page,
        limit: 9,
        search: search || undefined,
        category: category || undefined,
        status: status || undefined,
      });
      setSchemes(data?.data || []);
      setPagination(data?.pagination || { currentPage: 1, totalPages: 1 });
    } catch (err) {
      setError(err.message || "Failed to load schemes");
      toast.error("Failed to load schemes");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status]);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) fetchSchemes();
    }, search ? 300 : 0);

    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, [search, category, status, page, fetchSchemes]);

  const handleSearchChange = useCallback((val) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((val) => {
    setCategory(val);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((val) => {
    setStatus(val);
    setPage(1);
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-700 px-6 py-9 text-white shadow-xl shadow-blue-900/10 sm:px-10 sm:py-12">
            <div className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />
            <div className="absolute -bottom-36 left-1/3 -z-10 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />
            <div className="relative max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-blue-50 backdrop-blur">
                <ShieldCheck size={16} /> Support for every stage of life
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{t("welfareSchemes")}</h1>
              <p className="mt-3 text-base leading-relaxed text-blue-100 sm:text-lg">{t("browseAndApply")}</p>
              <a href="#scheme-results" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/30">
                Explore schemes <ArrowDown size={16} />
              </a>
            </div>
            <div className="absolute bottom-8 right-10 hidden rounded-2xl border border-white/15 bg-white/10 p-5 text-white/90 backdrop-blur sm:block">
              <HandCoins size={32} strokeWidth={1.5} />
              <p className="mt-3 text-sm font-semibold">Find the support<br />you may be eligible for</p>
            </div>
          </header>

          <section className="mt-8" aria-label="Filter welfare schemes">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-600">
              <Search size={16} className="text-blue-700" /> Find a scheme
            </div>
            <SchemeFilters
              search={search}
              category={category}
              status={status}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onStatusChange={handleStatusChange}
            />
          </section>

          <section id="scheme-results" className="mt-9 scroll-mt-6" aria-label="Scheme results">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Browse opportunities</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Schemes for your community</h2>
              </div>
              {!loading && !error && schemes.length > 0 && (
                <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
                  {schemes.length} {schemes.length === 1 ? "scheme" : "schemes"} on this page
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-sm">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <EmptyState title="Error" description={error} />
              </div>
            ) : schemes.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <EmptyState title={t("noSchemesFound")} description={t("tryAdjusting")} />
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {schemes.map((scheme) => <SchemeCard key={scheme._id} scheme={scheme} />)}
                </div>
                <div className="mt-10">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

export default Schemes;

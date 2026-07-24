import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
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
      if (isMounted) {
        fetchSchemes();
      }
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
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("welfareSchemes")}</h1>
          <p className="mt-2 text-gray-500">
            {t("browseAndApply")}
          </p>
        </div>

        <SchemeFilters
          search={search}
          category={category}
          status={status}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onStatusChange={handleStatusChange}
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="mt-8">
            <EmptyState
              title="Error"
              description={error}
            />
          </div>
        ) : schemes.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title={t("noSchemesFound")}
              description={t("tryAdjusting")}
            />
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {schemes.map((scheme) => (
                <SchemeCard key={scheme._id} scheme={scheme} />
              ))}
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
      </div>
    </PageLayout>
  );
}

export default Schemes;
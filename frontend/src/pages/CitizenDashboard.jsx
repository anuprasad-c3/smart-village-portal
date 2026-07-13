import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import PageLayout from "../components/layout/PageLayout";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { dashboardService } from "../services/dashboardService";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";

function CitizenDashboardContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getCitizenStats()
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("welcome")} {user?.fullName?.split(" ")[0]}
          </h1>
          <p className="mt-2 text-gray-500">{t("trackApplications")}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title={t("totalApplications")} value={stats?.total ?? 0} icon={FiFileText} color="blue" />
              <StatCard title={t("pending")} value={stats?.pending ?? 0} icon={FiClock} color="yellow" />
              <StatCard title={t("approved")} value={stats?.approved ?? 0} icon={FiCheckCircle} color="green" />
              <StatCard title={t("rejected")} value={stats?.rejected ?? 0} icon={FiXCircle} color="red" />
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/schemes">
                <Button>{t("exploreSchemes")}</Button>
              </Link>
              <Link to="/my-applications">
                <Button variant="outline">{t("viewMyApplications")}</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}

function CitizenDashboard() {
  return (
    <ProtectedRoute>
      <CitizenDashboardContent />
    </ProtectedRoute>
  );
}

export default CitizenDashboard;

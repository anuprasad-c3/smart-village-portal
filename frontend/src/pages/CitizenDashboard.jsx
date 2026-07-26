import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiGrid,
  FiCalendar,
  FiBell,
  FiUser,
  FiChevronRight,
} from "react-icons/fi";
import PageLayout from "../components/layout/PageLayout";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { applicationService } from "../services/applicationService";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";

function CitizenDashboardContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await applicationService.getMyApplications();
        const applications = data.data ?? [];
        const countByStatus = (status) =>
          applications.filter(
            (application) => application.status?.toLowerCase() === status
          ).length;

        setDashboardData({
          total: applications.length,
          pending: countByStatus("pending"),
          approved: countByStatus("approved"),
          rejected: countByStatus("rejected"),
        });
      } catch (error) {
        console.error("Failed to load application statistics:", error);
        setError("Unable to load your application statistics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Quick actions data
  const quickActions = [
    {
      title: "Browse Schemes",
      icon: FiGrid,
      link: "/schemes",
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Book Appointment",
      icon: FiCalendar,
      link: "/appointments/book",
      color: "text-green-600 bg-green-50",
    },
    {
      title: "My Applications",
      icon: FiFileText,
      link: "/my-applications",
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Updates",
      icon: FiBell,
      link: "/updates",
      color: "text-orange-600 bg-orange-50",
    },
    {
      title: "Profile",
      icon: FiUser,
      link: "/profile",
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {getGreeting()}, {user?.fullName?.split(" ")[0] || "User"}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome to Smart Panchayat Portal
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {error && (
            <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* Statistics Section */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t("totalApplications")}
              value={dashboardData?.total ?? 0}
              icon={FiFileText}
              color="blue"
            />
            <StatCard
              title={t("pending")}
              value={dashboardData?.pending ?? 0}
              icon={FiClock}
              color="yellow"
            />
            <StatCard
              title={t("approved")}
              value={dashboardData?.approved ?? 0}
              icon={FiCheckCircle}
              color="green"
            />
            <StatCard
              title={t("rejected")}
              value={dashboardData?.rejected ?? 0}
              icon={FiXCircle}
              color="red"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="mb-4 text-base font-medium text-gray-900">
              Quick Actions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="group rounded-xl bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg p-2.5 transition-all duration-200 ${action.color} group-hover:scale-110`}
                      >
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {action.title}
                      </span>
                    </div>
                    <FiChevronRight className="h-4 w-4 text-gray-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-600" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
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

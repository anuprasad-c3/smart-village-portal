import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiFileText,
  FiLayers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import PageLayout from "../../components/layout/PageLayout";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { dashboardService } from "../../services/dashboardService";

function AdminDashboardContent() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getAdminStats()
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-500">Overview of the Smart Panchayat portal</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard title="Total Citizens" value={stats?.totalUsers ?? 0} icon={FiUsers} color="purple" />
              <StatCard title="Total Schemes" value={stats?.totalSchemes ?? 0} icon={FiLayers} color="blue" />
              <StatCard title="Total Applications" value={stats?.totalApplications ?? 0} icon={FiFileText} color="green" />
              <StatCard title="Pending" value={stats?.pending ?? 0} icon={FiClock} color="yellow" />
              <StatCard title="Approved" value={stats?.approved ?? 0} icon={FiCheckCircle} color="green" />
              <StatCard title="Rejected" value={stats?.rejected ?? 0} icon={FiXCircle} color="red" />
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/admin/schemes">
                <Button>Manage Schemes</Button>
              </Link>
              <Link to="/admin/applications">
                <Button variant="outline">Review Applications</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}

function AdminDashboard() {
  return (
    <ProtectedRoute adminOnly>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

export default AdminDashboard;

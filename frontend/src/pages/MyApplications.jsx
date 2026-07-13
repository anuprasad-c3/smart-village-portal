import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import ApplicationCard from "../components/applications/ApplicationCard";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { applicationService } from "../services/applicationService";
import { getUploadUrl } from "../utils/getUploadUrl";

function MyApplicationsContent() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService
      .getMyApplications()
      .then((res) => setApplications(res.data.data))
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="mt-2 text-gray-500">Track the status of your scheme applications</p>
          </div>
          <Link to="/schemes">
            <Button>Apply for a Scheme</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Browse available schemes and submit your first application"
            action={
              <Link to="/schemes">
                <Button>Browse Schemes</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id}>
                <ApplicationCard application={app} />
                {app.uploadedDocuments?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 pl-2">
                    {app.uploadedDocuments.map((doc, i) => (
                      <a
                        key={i}
                        href={getUploadUrl(doc.filePath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
                      >
                        {doc.originalName}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function MyApplications() {
  return (
    <ProtectedRoute>
      <MyApplicationsContent />
    </ProtectedRoute>
  );
}

export default MyApplications;

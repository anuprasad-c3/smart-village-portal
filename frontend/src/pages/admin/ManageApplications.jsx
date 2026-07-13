import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageLayout from "../../components/layout/PageLayout";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import Spinner from "../../components/ui/Spinner";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { applicationService } from "../../services/applicationService";
import { getUploadUrl } from "../../utils/getUploadUrl";
import { formatDate } from "../../utils/formatDate";
import { APPLICATION_STATUSES } from "../../constants/schemeCategories";

function ManageApplicationsContent() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [remarks, setRemarks] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchApplications = () => {
    setLoading(true);
    applicationService
      .getAll()
      .then((res) => setApplications(res.data.data))
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openReview = (app) => {
    setSelected(app);
    setStatus(app.status);
    setRemarks(app.remarks || "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selected) return;

    setUpdating(true);
    try {
      await applicationService.updateStatus(selected._id, { status, remarks });
      toast.success("Application updated");
      setSelected(null);
      fetchApplications();
    } catch {
      toast.error("Failed to update application");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Applications</h1>
          <p className="mt-2 text-gray-500">Review and update citizen scheme applications</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : applications.length === 0 ? (
          <EmptyState title="No applications yet" description="Applications will appear here when citizens apply" />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Applicant</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Scheme</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b border-gray-100">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{app.applicant?.fullName}</p>
                      <p className="text-gray-500">{app.applicant?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{app.scheme?.title}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(app.createdAt)}</td>
                    <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="outline" onClick={() => openReview(app)}>
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
              <h2 className="text-xl font-bold text-gray-900">Review Application</h2>

              <div className="mt-4 space-y-3 text-sm">
                <p><span className="font-medium">Applicant:</span> {selected.applicant?.fullName}</p>
                <p><span className="font-medium">Email:</span> {selected.applicant?.email}</p>
                <p><span className="font-medium">Phone:</span> {selected.applicant?.phone}</p>
                <p><span className="font-medium">Scheme:</span> {selected.scheme?.title}</p>
              </div>

              {selected.uploadedDocuments?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">Documents:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.uploadedDocuments.map((doc, i) => (
                      <a
                        key={i}
                        href={getUploadUrl(doc.filePath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-blue-50 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100"
                      >
                        {doc.originalName}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleUpdate} className="mt-6 space-y-4">
                <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>

                <Textarea
                  label="Remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  placeholder="Optional remarks for the applicant"
                />

                <div className="flex gap-3">
                  <Button type="submit" disabled={updating}>
                    {updating ? "Updating..." : "Update Status"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setSelected(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function ManageApplications() {
  return (
    <ProtectedRoute adminOnly>
      <ManageApplicationsContent />
    </ProtectedRoute>
  );
}

export default ManageApplications;

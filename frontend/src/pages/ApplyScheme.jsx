import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { schemeService } from "../services/schemeService";
import { applicationService } from "../services/applicationService";

const MAX_FILES = 5;
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function ApplySchemeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    schemeService
      .getById(id)
      .then((res) => setScheme(res.data.data))
      .catch(() => toast.error("Scheme not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);

    if (selected.length + files.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }
    for (const file of selected) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Only PDF, JPG, and PNG allowed`);
        return;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name}: File must be under 5MB`);
        return;
      }
    }

    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }

    setSubmitting(true);
    try {
      await applicationService.apply(id, files);
      toast.success("Application submitted successfully!");
      navigate("/my-applications");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }
  if (!scheme) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="text-2xl font-bold">Scheme not found</h1>
          <Link to="/schemes" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to schemes
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link to={`/schemes/${id}`} className="text-sm text-blue-600 hover:underline">
          ← Back to scheme
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Apply for Scheme</h1>
          <p className="mt-2 text-gray-600">{scheme.title}</p>

          {scheme.requiredDocuments?.length > 0 && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-800">Required documents:</p>
              <ul className="mt-2 list-inside list-disc text-sm text-blue-700">
                {scheme.requiredDocuments.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Upload Documents (PDF, JPG, PNG — max 5 files, 5MB each)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {files.length > 0 && (
              <ul className="space-y-2">
                {files.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2 text-sm"
                  >
                    <span className="truncate text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}

function ApplyScheme() {
  return (
    <ProtectedRoute>
      <ApplySchemeForm />
    </ProtectedRoute>
  );
}

export default ApplyScheme;

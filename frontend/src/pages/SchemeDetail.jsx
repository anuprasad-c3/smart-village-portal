import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import StatusBadge from "../components/ui/StatusBadge";
import { schemeService } from "../services/schemeService";
import { useAuth } from "../hooks/useAuth";
import { formatDate, isPastDate } from "../utils/formatDate";

function SchemeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schemeService
      .getById(id)
      .then((res) => setScheme(res.data.data))
      .catch(() => toast.error("Scheme not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = () => {
    if (!user) {
      toast.error("Please login to apply");
      navigate("/login", { state: { from: { pathname: `/schemes/${id}/apply` } } });
      return;
    }
    if (user.role === "admin") {
      toast.error("Admins cannot apply for schemes");
      return;
    }
    navigate(`/schemes/${id}/apply`);
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
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Scheme not found</h1>
          <Link to="/schemes" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to schemes
          </Link>
        </div>
      </PageLayout>
    );
  }

  const expired = isPastDate(scheme.lastDate);
  const displayStatus =
  expired ? "Expired" : scheme.status;
  const canApply = scheme.status === "Active" && !expired;

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link to="/schemes" className="text-sm text-blue-600 hover:underline">
          ← Back to schemes
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {scheme.category}
              </span>
              <h1 className="mt-3 text-3xl font-bold text-gray-900">{scheme.title}</h1>
              {scheme.department && (
                <p className="mt-2 text-gray-500">{scheme.department}</p>
              )}
            </div>
            <StatusBadge status={displayStatus} />
          </div>

          <p className="mt-6 text-gray-700 leading-relaxed">{scheme.description}</p>

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">
              Application deadline: {formatDate(scheme.lastDate)}
            </p>
            {expired && (
              <p className="mt-1 text-sm text-red-600">This scheme has expired</p>
            )}
          </div>

          {scheme.eligibility?.length > 0 && (
            <Section title="Eligibility">
              <ul className="list-inside list-disc space-y-1 text-gray-700">
                {scheme.eligibility.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {scheme.requiredDocuments?.length > 0 && (
            <Section title="Required Documents">
              <ul className="list-inside list-disc space-y-1 text-gray-700">
                {scheme.requiredDocuments.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {scheme.benefits?.length > 0 && (
            <Section title="Benefits">
              <ul className="list-inside list-disc space-y-1 text-gray-700">
                {scheme.benefits.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {canApply && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <Button onClick={handleApply}>Apply for this Scheme</Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default SchemeDetail;

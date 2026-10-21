import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, FileText, Sparkles } from "lucide-react";
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

  const pendingCount = applications.filter((app) => app.status?.toLowerCase() === "pending").length;
  const approvedCount = applications.filter((app) => app.status?.toLowerCase() === "approved").length;

  return (
    <PageLayout>
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-blue-900 to-cyan-800 px-6 py-9 text-white shadow-xl shadow-blue-950/10 sm:px-10 sm:py-11">
            <div className="absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-blue-50 backdrop-blur">
                  <Sparkles size={16} /> Your support journey
                </span>
                <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">My Applications</h1>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-blue-100 sm:text-lg">
                  Keep track of your scheme applications, updates, and submitted documents in one place.
                </p>
              </div>
              <Link to="/schemes" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/30">
                Explore schemes <ArrowRight size={17} />
              </Link>
            </div>
          </header>

          <section className="mt-6 grid gap-4 sm:grid-cols-3" aria-label="Application overview">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><ClipboardList size={23} /></span>
              <div><p className="text-sm font-medium text-slate-500">Total applications</p><p className="mt-0.5 text-2xl font-bold text-slate-900">{loading ? "—" : applications.length}</p></div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><FileText size={23} /></span>
              <div><p className="text-sm font-medium text-slate-500">Under review</p><p className="mt-0.5 text-2xl font-bold text-slate-900">{loading ? "—" : pendingCount}</p></div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Sparkles size={23} /></span>
              <div><p className="text-sm font-medium text-slate-500">Approved</p><p className="mt-0.5 text-2xl font-bold text-slate-900">{loading ? "—" : approvedCount}</p></div>
            </div>
          </section>

          <section className="mt-9" aria-label="Your applications">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Application history</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Your submissions</h2>
              </div>
              {!loading && applications.length > 0 && <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">{applications.length} {applications.length === 1 ? "application" : "applications"}</span>}
            </div>

            {loading ? (
              <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-sm"><Spinner size="lg" /></div>
            ) : applications.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <EmptyState
                  title="No applications yet"
                  description="Browse available schemes and submit your first application to get started."
                  action={<Link to="/schemes"><Button>Browse schemes</Button></Link>}
                />
              </div>
            ) : (
              <div className="space-y-5">
                {applications.map((app) => (
                  <article key={app._id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-4">
                    <ApplicationCard application={app} />
                    {app.uploadedDocuments?.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 px-3 pt-3 sm:px-6">
                        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Documents</span>
                        {app.uploadedDocuments.map((doc, i) => (
                          <a
                            key={`${doc.filePath}-${i}`}
                            href={getUploadUrl(doc.filePath)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex max-w-full items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-800"
                          >
                            <FileText size={14} className="shrink-0" />
                            <span className="truncate">{doc.originalName}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
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


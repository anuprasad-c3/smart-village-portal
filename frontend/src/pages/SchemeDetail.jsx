import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, CalendarDays, CheckCircle2, Clock3, FileCheck2, Gift, ShieldCheck } from "lucide-react";
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
        <div className="flex min-h-[50vh] justify-center bg-slate-50 py-20"><Spinner size="lg" /></div>
      </PageLayout>
    );
  }

  if (!scheme) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] bg-slate-50 px-4 py-20 text-center">
          <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Scheme not found</h1>
            <p className="mt-2 text-slate-600">This scheme may have been removed or the link may be incorrect.</p>
            <Link to="/schemes" className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-800 hover:text-blue-950"><ArrowLeft size={17} /> Back to schemes</Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const expired = isPastDate(scheme.lastDate);
  const displayStatus = expired ? "Expired" : scheme.status;
  const canApply = scheme.status === "Active" && !expired;

  return (
    <PageLayout>
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link to="/schemes" className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-blue-800"><ArrowLeft size={17} /> All schemes</Link>

          <header className="relative isolate mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-blue-900 to-cyan-800 px-6 py-9 text-white shadow-xl shadow-blue-950/10 sm:px-10 sm:py-11">
            <div className="absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />
            <div className="relative flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-blue-50 backdrop-blur"><ShieldCheck size={16} /> {scheme.category}</span>
                <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{scheme.title}</h1>
                {scheme.department && <p className="mt-3 inline-flex items-center gap-2 text-blue-100"><Building2 size={17} /> {scheme.department}</p>}
              </div>
              <StatusBadge status={displayStatus} />
            </div>
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">About this scheme</p>
                <p className="mt-3 whitespace-pre-line text-base leading-7 text-slate-700">{scheme.description}</p>
              </section>

              {scheme.eligibility?.length > 0 && <Section title="Eligibility" icon={CheckCircle2} items={scheme.eligibility} />}
              {scheme.requiredDocuments?.length > 0 && <Section title="Required documents" icon={FileCheck2} items={scheme.requiredDocuments} />}
              {scheme.benefits?.length > 0 && <Section title="Benefits" icon={Gift} items={scheme.benefits} />}
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><CalendarDays size={23} /></div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">Application deadline</h2>
              <p className="mt-1 text-xl font-semibold text-blue-900">{formatDate(scheme.lastDate)}</p>
              {expired ? (
                <p className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700"><Clock3 size={16} /> This scheme has expired</p>
              ) : (
                <p className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-800"><Clock3 size={16} /> Applications are {scheme.status?.toLowerCase()}</p>
              )}
              {canApply && <Button onClick={handleApply} className="mt-5 w-full rounded-xl py-3">Apply for this scheme <ArrowRight size={17} /></Button>}
              {!canApply && !expired && <p className="mt-5 text-sm leading-relaxed text-slate-500">Applications are currently unavailable for this scheme.</p>}
              <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">Review eligibility and required documents before starting your application.</p>
            </aside>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

function Section({ title, icon: Icon, items }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><Icon size={20} /></span>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((item, i) => <li key={i} className="flex items-start gap-3 text-slate-700"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" /><span className="leading-relaxed">{item}</span></li>)}
      </ul>
    </section>
  );
}

export default SchemeDetail;

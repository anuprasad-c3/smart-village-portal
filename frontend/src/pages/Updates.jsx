import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, Megaphone, Newspaper } from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { updateService } from "../services/updateService";
import { formatDate } from "../utils/formatDate";

function Updates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const { data } = await updateService.getAll();
      setUpdates(data.data ?? []);
    } catch {
      toast.error("Failed to load updates");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 px-6 py-9 text-white shadow-xl shadow-emerald-900/10 sm:px-10 sm:py-12">
            <div className="absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-lime-300/15 blur-3xl" />
            <div className="absolute -bottom-36 right-1/3 -z-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-emerald-50 backdrop-blur">
                <Megaphone size={16} /> From your Panchayat
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Panchayat Updates</h1>
              <p className="mt-3 text-base leading-relaxed text-emerald-100 sm:text-lg">
                Announcements, community works, and the latest activities from across your village.
              </p>
              {!loading && updates.length > 0 && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-sm font-medium text-white/95">
                  <Newspaper size={17} /> {updates.length} {updates.length === 1 ? "update" : "updates"} to explore
                </div>
              )}
            </div>
          </header>

          <section className="mt-8" aria-label="Latest Panchayat updates">
            {loading ? (
              <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-sm">
                <Spinner size="lg" />
              </div>
            ) : updates.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Newspaper size={23} />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">No updates just yet</h2>
                <p className="mt-1 text-sm text-slate-500">Check back soon for announcements and community news.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((item, index) => (
                  <article
                    key={item._id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md sm:p-6"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-400 opacity-70 transition group-hover:opacity-100" />
                    <div className="flex gap-4 sm:gap-5">
                      <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 sm:flex">
                        <Megaphone size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-emerald-800">
                          <CalendarDays size={15} />
                          <time>{formatDate(item.date)}</time>
                          <span className="text-slate-300" aria-hidden="true">·</span>
                          <span className="text-slate-400">Update {String(index + 1).padStart(2, "0")}</span>
                        </div>
                        <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-700 sm:text-[17px]">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

export default Updates;

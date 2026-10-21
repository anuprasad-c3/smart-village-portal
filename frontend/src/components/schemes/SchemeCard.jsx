import { ArrowUpRight, CalendarDays, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";
import { formatDate, isPastDate } from "../../utils/formatDate";
import { useLanguage } from "../../context/LanguageContext";

function SchemeCard({ scheme }) {
  const { t } = useLanguage();
  const displayStatus = isPastDate(scheme.lastDate) ? "Expired" : scheme.status;

  return (
    <Link
      to={`/schemes/${scheme._id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/5 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:p-6"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-800 via-indigo-600 to-cyan-500" />
      <div className="mb-5 flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-800">
          <Landmark size={14} /> {scheme.category}
        </span>
        <StatusBadge status={displayStatus} />
      </div>

      <h3 className="text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-800">
        {scheme.title}
      </h3>

      {scheme.department && (
        <p className="mt-2 text-sm font-medium text-slate-500">{scheme.department}</p>
      )}

      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
        {scheme.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
          <CalendarDays size={15} className="text-blue-700" />
          {t("lastDate")}: {formatDate(scheme.lastDate)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800">
          {t("viewDetails")} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

export default SchemeCard;

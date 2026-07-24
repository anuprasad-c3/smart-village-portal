import { Link } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";
import { formatDate, isPastDate } from "../../utils/formatDate";
import { useLanguage } from "../../context/LanguageContext";

function SchemeCard({ scheme }) {
  const { t } = useLanguage();

  const displayStatus = isPastDate(scheme.lastDate)
    ? "Expired"
    : scheme.status;

  return (
    <Link
      to={`/schemes/${scheme._id}`}
      className="group flex flex-col solid-card p-6 border-l-4 border-l-blue-800"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="rounded bg-gray-100 px-3 py-1 text-xs font-bold text-gray-800 uppercase tracking-wider">
          {scheme.category}
        </span>

        <StatusBadge status={displayStatus} />
      </div>

      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-800 group-hover:underline">
        {scheme.title}
      </h3>

      {scheme.department && (
        <p className="mt-1 text-sm font-semibold text-gray-600">
          {scheme.department}
        </p>
      )}

      <p className="mt-3 line-clamp-2 flex-1 text-sm text-gray-700 leading-relaxed">
        {scheme.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 text-sm font-medium">
        <span className="text-gray-600">
          {t("lastDate")}: {formatDate(scheme.lastDate)}
        </span>

        <span className="flex items-center gap-1 text-blue-800">
          {t("viewDetails")} <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}

export default SchemeCard;
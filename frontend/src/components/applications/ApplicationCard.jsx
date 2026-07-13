import { Link } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";
import { formatDate } from "../../utils/formatDate";

function ApplicationCard({ application, showApplicant = false }) {
  const scheme = application.scheme;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {scheme?.title || "Unknown Scheme"}
          </h3>
          {scheme?.category && (
            <p className="mt-1 text-sm text-gray-500">{scheme.category}</p>
          )}
          {showApplicant && application.applicant && (
            <p className="mt-2 text-sm text-gray-600">
              Applicant: {application.applicant.fullName} ({application.applicant.email})
            </p>
          )}
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
        <span>Applied: {formatDate(application.createdAt)}</span>
        {application.remarks && (
          <span className="text-gray-700 text-red-500">Remarks: {application.remarks}</span>
        )}
      </div>

      {application.uploadedDocuments?.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700">
            Documents ({application.uploadedDocuments.length})
          </p>
        </div>
      )}

      {!showApplicant && scheme?._id && (
        <Link
          to={`/schemes/${scheme._id}`}
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          View scheme →
        </Link>
      )}
    </div>
  );
}

export default ApplicationCard;

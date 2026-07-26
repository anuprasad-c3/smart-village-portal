import {
  Calendar,
  Clock,
  Building2,
  Users,
  CheckCircle2,
} from "lucide-react";

function SlotCard({ slot, selected, onSelect }) {
  const remaining = slot.maxBookings - slot.bookedCount;

  const formattedDate = new Date(slot.date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      onClick={() => remaining > 0 && onSelect(slot)}
      className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300

      ${
        selected
          ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
          : "border-gray-200 bg-white hover:border-blue-500 hover:shadow-lg hover:-translate-y-1"
      }

      ${remaining === 0 ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-2">
          <Building2 size={18} className="text-blue-600" />
          <span className="font-semibold">
            {slot.department}
          </span>
        </div>

        {remaining > 0 ? (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
            Available
          </span>
        ) : (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
            Full
          </span>
        )}
      </div>

      <div className="mt-5 space-y-3">

        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-500" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={18} className="text-gray-500" />
          <span>
            {slot.startTime} - {slot.endTime}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users size={18} className="text-gray-500" />
          <span>
            {remaining} / {slot.maxBookings} Slots Left
          </span>
        </div>

      </div>

      {selected && (
        <div className="mt-5 flex items-center gap-2 text-blue-700 font-medium">
          <CheckCircle2 size={20} />
          Selected
        </div>
      )}
    </div>
  );
}

export default SlotCard;
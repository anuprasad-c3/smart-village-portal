import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardList, Clock3, HeartHandshake } from "lucide-react";
import SlotCard from "../components/appointment/SlotCard";
import AppointmentStatusBadge from "../components/appointment/AppointmentStatusBadge";
import { appointmentService } from "../services/appointmentService";
import PageLayout from "../components/layout/PageLayout";

function AppointmentBooking() {
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSlots = async () => {
    try {
      const res = await appointmentService.getAvailableSlots();
      setSlots(res.slots ?? []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to load slots");
    }
  };

  const loadAppointments = async () => {
    try {
      const res = await appointmentService.getMyAppointments();
      setAppointments(res.appointments ?? []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to load appointment status");
    }
  };

  useEffect(() => {
    loadSlots();
    loadAppointments();
  }, []);

  const handleBook = async () => {
    if (!selectedSlot) return toast.error("Select a slot");
    if (!reason.trim()) return toast.error("Enter reason");

    try {
      setLoading(true);
      await appointmentService.bookAppointment({ slotId: selectedSlot._id, reason: reason.trim() });
      toast.success("Appointment booked");
      setReason("");
      setSelectedSlot(null);
      loadSlots();
      loadAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 px-6 py-9 text-white shadow-xl shadow-blue-900/10 sm:px-10 sm:py-12">
            <div className="absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-32 right-1/4 -z-10 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-blue-50 backdrop-blur">
                <HeartHandshake size={16} /> Community services, made easier
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Book an appointment</h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-blue-100 sm:text-lg">
                Choose a convenient time to meet with your local service department. We’ll keep you updated on your request.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium text-white/90">
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2"><CalendarDays size={16} /> Pick a time</span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2"><ClipboardList size={16} /> Share your request</span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2"><CheckCircle2 size={16} /> Track your status</span>
            </div>
          </header>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <section aria-labelledby="slots-heading">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Step 1</p>
                  <h2 id="slots-heading" className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Available time slots</h2>
                  <p className="mt-1 text-sm text-slate-500">Select the time that works best for you.</p>
                </div>
                <span className="hidden rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 sm:inline-flex">
                  {slots.length} {slots.length === 1 ? "slot" : "slots"}
                </span>
              </div>

              {slots.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <CalendarDays className="mx-auto h-9 w-9 text-slate-400" />
                  <h3 className="mt-3 font-semibold text-slate-900">No slots available right now</h3>
                  <p className="mt-1 text-sm text-slate-500">Please check back soon for new appointment times.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {slots.map((slot) => (
                    <SlotCard
                      key={slot._id}
                      slot={slot}
                      selected={selectedSlot?._id === slot._id}
                      onSelect={setSelectedSlot}
                    />
                  ))}
                </div>
              )}
            </section>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Step 2</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Your request</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">Tell us briefly what you’d like help with.</p>

              {selectedSlot ? (
                <div className="mt-5 rounded-xl bg-blue-50 p-4 ring-1 ring-blue-100">
                  <div className="flex items-start gap-3">
                    <span className="rounded-lg bg-white p-2 text-blue-700 shadow-sm"><CalendarDays size={18} /></span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{selectedSlot.department}</p>
                      <p className="mt-1 text-sm text-slate-600">{new Date(selectedSlot.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-600"><Clock3 size={14} /> {selectedSlot.startTime} – {selectedSlot.endTime}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Choose a time slot to see your appointment details here.
                </div>
              )}

              <label htmlFor="appointment-reason" className="mt-5 block text-sm font-semibold text-slate-800">Reason for appointment</label>
              <textarea
                id="appointment-reason"
                placeholder="For example, I need help with..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2 min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                rows={4}
              />
              <p className="mt-2 text-xs text-slate-500">A short description helps us prepare for your visit.</p>

              <button
                onClick={handleBook}
                disabled={loading || !selectedSlot || !reason.trim()}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {loading ? "Booking..." : <>Book appointment <ArrowRight size={18} /></>}
              </button>
            </aside>
          </div>

          <section className="mt-12 border-t border-slate-200 pt-9" aria-labelledby="appointments-heading">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Your activity</p>
                <h2 id="appointments-heading" className="mt-1 text-2xl font-bold tracking-tight text-slate-900">My appointments</h2>
                <p className="mt-1 text-sm text-slate-500">Keep track of the status of your appointment requests.</p>
              </div>
              {appointments.length > 0 && <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">{appointments.length} {appointments.length === 1 ? "request" : "requests"}</span>}
            </div>

            {appointments.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><ClipboardList size={22} /></span>
                <h3 className="mt-3 font-semibold text-slate-900">No appointments yet</h3>
                <p className="mt-1 text-sm text-slate-500">Once you make a request, its status will appear here.</p>
              </div>
            ) : (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {appointments.map((appointment) => (
                  <article key={appointment._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900">{appointment.slot?.department || "Appointment"}</h3>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-600">
                          <CalendarDays size={15} />
                          {appointment.slot?.date && new Date(appointment.slot.date).toLocaleDateString("en-IN")} · {appointment.slot?.startTime} – {appointment.slot?.endTime}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-500">{appointment.reason}</p>
                      </div>
                      <AppointmentStatusBadge status={appointment.status} />
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

export default AppointmentBooking;

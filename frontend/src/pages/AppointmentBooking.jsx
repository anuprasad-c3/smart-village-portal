import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
    setSlots(res.slots);
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
  const loadInitialData = async () => {
    try {
      const [slotsResponse, appointmentsResponse] = await Promise.all([
        appointmentService.getAvailableSlots(),
        appointmentService.getMyAppointments(),
      ]);
      setSlots(slotsResponse.slots ?? []);
      setAppointments(appointmentsResponse.appointments ?? []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to load appointments");
    }
  };

  loadInitialData();
}, []);

  const handleBook = async () => {
    if (!selectedSlot) return toast.error("Select a slot");

    if (!reason) return toast.error("Enter reason");

    try {
      setLoading(true);

      await appointmentService.bookAppointment({
        slotId: selectedSlot._id,
        reason,
      });

      toast.success("Appointment Booked");

      setReason("");
      setSelectedSlot(null);

      loadSlots();
      loadAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Book Appointment</h1>

      <div className="grid md:grid-cols-3 gap-5">
        {slots.map((slot) => (
          <SlotCard
            key={slot._id}
            slot={slot}
            selected={selectedSlot?._id === slot._id}
            onSelect={setSelectedSlot}
          />
        ))}
      </div>

      <textarea
        placeholder="Reason for appointment..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full mt-8 border rounded-lg p-4"
        rows={4}
      />

      <button
        onClick={handleBook}
        disabled={loading}
        className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">My Requested Appointments</h2>
        <p className="mt-1 text-sm text-gray-500">Track the current status of your appointment requests.</p>

        {appointments.length === 0 ? (
          <p className="mt-4 rounded-lg bg-gray-50 p-4 text-gray-500">You have not requested any appointments yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {appointments.map((appointment) => (
              <article key={appointment._id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{appointment.slot?.department || "Appointment"}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {appointment.slot?.date && new Date(appointment.slot.date).toLocaleDateString("en-IN")} · {appointment.slot?.startTime} - {appointment.slot?.endTime}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">Reason: {appointment.reason}</p>
                  </div>
                  <AppointmentStatusBadge status={appointment.status} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      </div>
    </PageLayout>
  );
}

export default AppointmentBooking;

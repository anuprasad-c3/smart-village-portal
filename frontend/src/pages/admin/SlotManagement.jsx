import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageLayout from "../../components/layout/PageLayout";
import Button from "../../components/ui/Button";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { appointmentService } from "../../services/appointmentService";

const departments = ["Secretary", "Revenue", "Agriculture", "Health", "Welfare", "Tax", "Birth Certificate", "Death Certificate", "Building Permit"];
const emptyForm = { department: departments[0], date: "", startTime: "", endTime: "", maxBookings: 1 };

function SlotManagementContent() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSlots = async () => {
    try {
      const data = await appointmentService.getAllSlots();
      setSlots(data.slots ?? []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await appointmentService.getAllSlots();
        setSlots(data.slots ?? []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load slots");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleChange = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));

  const handleCreate = async (event) => {
    event.preventDefault();
    if (form.startTime >= form.endTime) return toast.error("End time must be after start time");
    try {
      setSaving(true);
      await appointmentService.createSlot({ ...form, maxBookings: Number(form.maxBookings) });
      toast.success("Slot created");
      setForm(emptyForm);
      await loadSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create slot");
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (slot) => {
    try {
      await appointmentService.updateSlotAvailability(slot._id, !slot.isActive);
      toast.success(`Slot ${slot.isActive ? "closed" : "opened"}`);
      await loadSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update slot");
    }
  };

  return <PageLayout><div className="mx-auto max-w-7xl px-6 py-12">
    <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Manage Appointment Slots</h1><p className="mt-2 text-gray-500">Create availability and open or close existing slots.</p></div>
    <form onSubmit={handleCreate} className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-3">
      <label className="text-sm font-medium text-gray-700">Department<select name="department" value={form.department} onChange={handleChange} className="mt-1 w-full rounded border p-2" required>{departments.map((department) => <option key={department}>{department}</option>)}</select></label>
      <label className="text-sm font-medium text-gray-700">Date<input name="date" type="date" value={form.date} onChange={handleChange} className="mt-1 w-full rounded border p-2" required /></label>
      <label className="text-sm font-medium text-gray-700">Maximum bookings<input name="maxBookings" type="number" min="1" value={form.maxBookings} onChange={handleChange} className="mt-1 w-full rounded border p-2" required /></label>
      <label className="text-sm font-medium text-gray-700">Start time<input name="startTime" type="time" value={form.startTime} onChange={handleChange} className="mt-1 w-full rounded border p-2" required /></label>
      <label className="text-sm font-medium text-gray-700">End time<input name="endTime" type="time" value={form.endTime} onChange={handleChange} className="mt-1 w-full rounded border p-2" required /></label>
      <div className="flex items-end"><Button type="submit" disabled={saving}>{saving ? "Creating..." : "Add Slot"}</Button></div>
    </form>
    {loading ? <p className="py-8 text-center text-gray-500">Loading slots...</p> : <div className="overflow-x-auto rounded-xl bg-white shadow-sm"><table className="min-w-full text-left"><thead className="bg-gray-50 text-sm text-gray-600"><tr><th className="p-4">Department</th><th className="p-4">Date</th><th className="p-4">Time</th><th className="p-4">Bookings</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody>
      {slots.map((slot) => <tr key={slot._id} className="border-t"><td className="p-4">{slot.department}</td><td className="p-4">{new Date(slot.date).toLocaleDateString()}</td><td className="p-4">{slot.startTime} – {slot.endTime}</td><td className="p-4">{slot.bookedCount} / {slot.maxBookings}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-sm ${slot.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{slot.isActive ? "Open" : "Closed"}</span></td><td className="p-4"><Button size="sm" variant={slot.isActive ? "outline" : "primary"} onClick={() => toggleAvailability(slot)}>{slot.isActive ? "Close" : "Open"}</Button></td></tr>)}
      {slots.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-500">No slots created yet.</td></tr>}
    </tbody></table></div>}
  </div></PageLayout>;
}

export default function SlotManagement() {
  return <ProtectedRoute adminOnly><SlotManagementContent /></ProtectedRoute>;
}

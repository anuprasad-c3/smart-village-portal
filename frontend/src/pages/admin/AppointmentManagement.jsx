import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PageLayout from "../../components/layout/PageLayout";
import { appointmentService } from "../../services/appointmentService";

function AdminAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      setLoading(true);

      const res = await appointmentService.getAllAppointments();

      setAppointments(res.appointments || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);

      toast.success("Appointment updated");

      loadAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const citizen = appointment.citizen?.fullName?.toLowerCase() || "";

      const searchMatch = citizen.includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" || appointment.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [appointments, search, statusFilter]);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        Loading...
      </div>
    );

    return (
      <PageLayout>
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Appointment Management
      </h1>

      <div className="flex gap-4 mb-6">

        <input
          type="text"
          placeholder="Search citizen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-72"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">Citizen</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredAppointments.map((appointment) => (

              <tr
                key={appointment._id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-3">
                  {appointment.citizen?.fullName}
                  <br />
                  <span className="text-gray-500 text-sm">
                    {appointment.citizen?.email}
                  </span>
                </td>

                <td className="p-3">
                  {appointment.slot?.department}
                </td>

                <td className="p-3">
                  {new Date(
                    appointment.slot?.date
                  ).toLocaleDateString()}
                </td>

                <td className="p-3">
                  {appointment.slot?.startTime} -{" "}
                  {appointment.slot?.endTime}
                </td>

                <td className="p-3">
                  {appointment.reason}
                </td>

                <td className="p-3">

                  <span
                    className={`px-3 py-1 rounded-full text-sm

                    ${
                      appointment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : appointment.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : appointment.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : appointment.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }

                    `}
                  >
                    {appointment.status}
                  </span>

                </td>

                <td className="p-3">

                  <select
                    value={appointment.status}
                    onChange={(e) =>
                      handleStatus(
                        appointment._id,
                        e.target.value
                      )
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                    <option value="Completed">Complete</option>
                  </select>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

            </div>
            </PageLayout>
  );
}

export default AdminAppointment;
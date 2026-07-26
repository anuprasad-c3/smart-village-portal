import AppointmentRow from "./AppointmentRow";

function AppointmentTable({ appointments, onStatusChange }) {
  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Citizen</th>
          <th className="p-3">Date</th>
          <th className="p-3">Time</th>
          <th className="p-3">Reason</th>
          <th className="p-3">Status</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>

      <tbody>
        {appointments.map((appointment) => (
          <AppointmentRow
            key={appointment._id}
            appointment={appointment}
            onStatusChange={onStatusChange}
          />
        ))}
      </tbody>
    </table>
  );
}

export default AppointmentTable;
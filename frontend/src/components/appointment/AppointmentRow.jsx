import AppointmentStatusBadge from "./AppointmentStatusBadge";

function AppointmentRow({ appointment, onStatusChange }) {
  return (
    <tr className="border-b">
      <td className="p-3">{appointment.user?.name}</td>

      <td className="p-3">
        {appointment.slot?.date}
      </td>

      <td className="p-3">
        {appointment.slot?.startTime} - {appointment.slot?.endTime}
      </td>

      <td className="p-3">
        {appointment.reason}
      </td>

      <td className="p-3">
        <AppointmentStatusBadge status={appointment.status} />
      </td>

      <td className="p-3">
        <select
          value={appointment.status}
          onChange={(e) =>
            onStatusChange(appointment._id, e.target.value)
          }
          className="border rounded p-2"
        >
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Completed</option>
        </select>
      </td>
    </tr>
  );
}

export default AppointmentRow;
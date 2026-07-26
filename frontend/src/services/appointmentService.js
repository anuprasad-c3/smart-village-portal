import api from "./api";

export const appointmentService = {
  getAvailableSlots: async () => {
    const res = await api.get("/slots");
    return res.data;
  },

  getAllSlots: async () => {
    const res = await api.get("/slots/admin");
    return res.data;
  },

  createSlot: async (slot) => {
    const res = await api.post("/slots", slot);
    return res.data;
  },

  updateSlotAvailability: async (id, isActive) => {
    const res = await api.patch(`/slots/${id}/availability`, { isActive });
    return res.data;
  },

  bookAppointment: async (data) => {
    const res = await api.post("/appointments", data);
    return res.data;
  },

  getMyAppointments: async () => {
    const res = await api.get("/appointments");
    return res.data;
  },

  cancelAppointment: async (id) => {
    const res = await api.put(`/appointments/${id}/cancel`);
    return res.data;
  },
  getAllAppointments: async () => {
    const res = await api.get("/appointments/admin/all");
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.put(`/appointments/admin/${id}/status`, {
      status,
    });
    return res.data;
  },

  deleteAppointment: async (id) => {
    const res = await api.delete(`/admin/appointments/${id}`);
    return res.data;
  },
};

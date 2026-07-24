import API from "./api";

export const updateService = {
  getAll: () => API.get("/updates"),
  getById: (id) => API.get(`/updates/${id}`),
  create: (data) => API.post("/updates", data),
  update: (id, data) => API.put(`/updates/${id}`, data),
  delete: (id) => API.delete(`/updates/${id}`),
};
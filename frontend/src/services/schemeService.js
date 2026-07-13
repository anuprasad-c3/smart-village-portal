import API from "./api";

export const schemeService = {
  getAll: (params) => API.get("/schemes", { params }),
  getById: (id) => API.get(`/schemes/${id}`),
  create: (data) => API.post("/schemes", data),
  update: (id, data) => API.put(`/schemes/${id}`, data),
  delete: (id) => API.delete(`/schemes/${id}`),
};

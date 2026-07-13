import API from "./api";

export const applicationService = {
  apply: (schemeId, files) => {
    const formData = new FormData();
    formData.append("scheme", schemeId);
    files.forEach((file) => formData.append("documents", file));
    return API.post("/applications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getMyApplications: () => API.get("/applications/my"),
  getAll: () => API.get("/applications"),
  updateStatus: (id, data) => API.put(`/applications/${id}`, data),
};

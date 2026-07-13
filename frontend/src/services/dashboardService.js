import API from "./api";

export const dashboardService = {
  getCitizenStats: () => API.get("/dashboard/citizen"),
  getAdminStats: () => API.get("/dashboard/admin"),
};

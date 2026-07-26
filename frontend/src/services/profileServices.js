import API from "./api";

export const profileService = {
  getProfile: async () => {
    const res = await API.get("/profile");
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await API.put("/profile", data);
    return res.data;
  },

  changePassword: async (data) => {
    const res = await API.put("/profile/password", data);
    return res.data;
  },

  uploadProfilePhoto: async (file) => {
    const formData = new FormData();

    formData.append("profileImage", file);

    const res = await API.put("/profile/photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },
};
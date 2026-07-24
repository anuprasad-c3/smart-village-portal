import { createContext, useCallback, useEffect, useState } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getProfile()
      .then((res) => {
        if (res.data?.user) {
          const userData = {
            id: res.data.user._id || res.data.user.id,
            fullName: res.data.user.fullName,
            email: res.data.user.email,
            phone: res.data.user.phone,
            address: res.data.user.address,
            role: res.data.user.role,
            profileImage: res.data.user.profileImage,
            district: res.data.user.district,
            panchayat: res.data.user.panchayat,
            gender: res.data.user.gender,
            dob: res.data.user.dob,
            occupation: res.data.user.occupation,
          };
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        }
      })
      .catch(() => {
        logout();
      })
      .finally(() => setLoading(false));
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

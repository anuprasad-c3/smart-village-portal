import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import GuestRoute from "../components/auth/GuestRoute";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";

function LoginForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authService.login(form);
      login(data.token, data.user);
      toast.success("Welcome back!");

      if (from) {
        navigate(from, { replace: true });
      } else if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{t("login")}</h1>
          <p className="mt-2 text-gray-500">Access your Smart Panchayat account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              label={t("email")}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <Input
              label={t("password")}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("signingIn") : t("signIn")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t("dontHaveAccount")}{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              {t("registerHere")}
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

function Login() {
  return (
    <GuestRoute>
      <LoginForm />
    </GuestRoute>
  );
}

export default Login;

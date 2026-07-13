import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import GuestRoute from "../components/auth/GuestRoute";
import { authService } from "../services/authService";
import { useLanguage } from "../context/LanguageContext";

function RegisterForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(form);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-lg px-6 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{t("createAccount")}</h1>
          <p className="mt-2 text-gray-500">Register as a citizen to apply for welfare schemes</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              label={t("fullName")}
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />

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
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />

            <Input
              label={t("phone")}
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              required
            />

            <Textarea
              label={t("address")}
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Your village address"
              rows={3}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : t("register")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t("alreadyHaveAccount")}{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              {t("loginHere")}
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

function Register() {
  return (
    <GuestRoute>
      <RegisterForm />
    </GuestRoute>
  );
}

export default Register;

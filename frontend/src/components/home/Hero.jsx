import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiClock, FiShield, FiUsers, FiTrendingUp } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";
import { updateService } from "../../services/updateService";
import { formatDate } from "../../utils/formatDate";

function Hero() {
  const { t } = useLanguage();
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      setIsLoading(true);
      const { data } = await updateService.getAll();
      setUpdates(data.data.slice(0, 4));
    } catch (error) {
      console.error("Failed to fetch updates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: FiUsers, value: "12,500+", label: "Registered Citizens" },
    { icon: FiShield, value: "98%", label: "Scheme Coverage" },
    { icon: FiTrendingUp, value: "₹150Cr+", label: "Total Benefits Disbursed" },
    { icon: FiClock, value: "24/7", label: "Service Availability" },
  ];

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 backdrop-blur-sm rounded-full border border-blue-600/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
              </span>
              <span className="text-sm font-semibold text-blue-700">
                {t("officialPortal") || "Government of India Initiative"}
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-slate-900">
                  {t("heroTitle1") || "Digital"} 
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  {t("heroTitle2") || "Panchayat Services"}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                {t("heroDesc") || "Empowering rural communities through digital governance, transparent services, and inclusive development."}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/schemes"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-700/25 hover:shadow-xl hover:shadow-blue-700/30 hover:scale-[1.02] transition-all duration-200"
              >
                {t("exploreSchemes") || "Explore Schemes"}
                <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold border-2 border-slate-200 hover:border-blue-600 hover:text-blue-700 hover:shadow-lg transition-all duration-200"
              >
                {t("createAccount") || "Create Account"}
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-green-600 text-lg" />
                <span className="text-sm text-slate-600">100% Government</span>
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="text-blue-600 text-lg" />
                <span className="text-sm text-slate-600">Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">⭐ 4.9/5</span>
                <span className="text-sm text-slate-600">User Rating</span>
              </div>
            </div>
          </div>

          {/* Right Content - Notice Board */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="text-blue-600 text-lg" />
                      <span className="text-sm font-bold text-slate-800">{stat.value}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Notice Board */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
              <div className="relative bg-gradient-to-r from-blue-800 to-indigo-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                      <span className="text-xl">📢</span>
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">Notice Board</h2>
                      <p className="text-blue-200 text-xs">Latest announcements</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-blue-200 border border-white/10">
                    {updates.length} New
                  </span>
                </div>
              </div>

              <div className="p-5 max-h-[300px] overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-3 bg-slate-200 rounded w-1/4 mb-2" />
                        <div className="h-4 bg-slate-100 rounded w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : updates.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">No announcements available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {updates.map((item, index) => (
                      <div
                        key={item._id}
                        className={`group relative pl-4 py-2.5 ${
                          index !== updates.length - 1 ? "border-b border-slate-100" : ""
                        }`}
                      >
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-150 transition-transform duration-200" />
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-blue-700">
                            {formatDate(item.date)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                          {item.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50">
                <Link
                  to="/updates"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors group"
                >
                  View All Updates
                  <FiArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </section>
  );
}

export default Hero;

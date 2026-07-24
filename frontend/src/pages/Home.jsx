import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Footer from "../components/layout/Footer";
import { 
  FiUserPlus, 
  FiSearch, 
  FiTrendingUp, 
  FiAward,
  FiClock,
  FiShield,
  FiUsers,
  FiArrowRight,
  FiCheckCircle,
  FiFileText,
  FiBell,
  FiHome,
  FiDollarSign,
  FiBookOpen
} from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import { schemeService } from "../services/schemeService";

function Home() {
  const { t } = useLanguage();
  const [popularSchemes, setPopularSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPopularSchemes();
  }, []);

  const fetchPopularSchemes = async () => {
    try {
      setIsLoading(true);
      // Fetch top schemes - adjust based on your API
      const { data } = await schemeService.getPopular();
      setPopularSchemes(data.data.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch schemes:", error);
      // Fallback data if API fails
      setPopularSchemes([
        { _id: "1", title: "Pradhan Mantri Awas Yojana", category: "Housing", applications: "2,450+" },
        { _id: "2", title: "PM Kisan Samman Nidhi", category: "Agriculture", applications: "5,120+" },
        { _id: "3", title: "Ayushman Bharat Yojana", category: "Healthcare", applications: "3,890+" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // How It Works Steps
  const steps = [
    { 
      step: "1", 
      icon: FiUserPlus,
      title: "Register", 
      desc: "Create your citizen account with basic details and verify your identity",
      color: "from-blue-600 to-blue-700"
    },
    { 
      step: "2", 
      icon: FiSearch,
      title: "Browse & Apply", 
      desc: "Find welfare schemes, check eligibility, and upload required documents",
      color: "from-indigo-600 to-indigo-700"
    },
    { 
      step: "3", 
      icon: FiTrendingUp,
      title: "Track Status", 
      desc: "Monitor your application status and receive real-time updates",
      color: "from-violet-600 to-violet-700"
    },
  ];

  // Key Features
  const features = [
    { 
      icon: FiShield, 
      title: "Transparent Governance", 
      desc: "Complete visibility into scheme applications and fund disbursement",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    { 
      icon: FiClock, 
      title: "24/7 Accessibility", 
      desc: "Access all services anytime, anywhere from your device",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    { 
      icon: FiUsers, 
      title: "Community Support", 
      desc: "Connect with local panchayat officials and community leaders",
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600"
    },
    { 
      icon: FiBell, 
      title: "Real-time Notifications", 
      desc: "Instant alerts about scheme updates and application status changes",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
  ];

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />



      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Get started with digital panchayat services in three simple steps
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200 -translate-y-1/2 z-0" />
          
          {steps.map(({ step, icon: Icon, title, desc, color }) => (
            <div key={step} className="relative z-10 group">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="mt-2 text-sm font-semibold text-blue-600">Step {step}</div>
                <h3 className="mt-3 text-xl font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-800 transition-colors group"
          >
            Start Your Journey Now
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      

      {/* Key Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Empowering Rural India
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Built with trust, transparency, and technology at its core
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group rounded-2xl p-6 ${feature.bgColor} border border-transparent hover:border-${feature.iconColor.replace('text-', 'border-')}/20 hover:shadow-lg transition-all duration-300`}
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm group-hover:scale-105 transition-transform duration-300 ${feature.iconColor}`}>
                  <Icon className="text-2xl" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900" />
        {/* < div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"  /> */}
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Transform Your Community?
          </h2>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            Join thousands of citizens already benefiting from digital panchayat services
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-900 rounded-xl font-bold hover:bg-blue-50 hover:scale-[1.02] transition-all duration-200 shadow-xl shadow-blue-900/30"
            >
              Get Started Today
              <FiArrowRight className="text-xl" />
            </Link>
            <Link
              to="/schemes"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-800/40 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-blue-700/50 transition-all duration-200"
            >
              Browse Schemes
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-400" />
              Free to use
            </span>
            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-400" />
              No registration fee
            </span>
            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-400" />
              24/7 support
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
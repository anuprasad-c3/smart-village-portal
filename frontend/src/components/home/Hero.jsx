import { Link } from "react-router-dom";
import { FiArrowRight, FiPhoneCall, FiInfo } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";

function Hero() {
  const { t } = useLanguage();

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-100 text-blue-900 font-bold text-sm mb-6 uppercase tracking-wider">
              <span className="flex h-2 w-2 rounded-full bg-blue-700 animate-pulse"></span>
              {t("officialPortal")}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              {t("heroTitle1")} <br />
              <span className="text-blue-800">{t("heroTitle2")}</span>
            </h1>

            <p className="mt-6 text-lg text-gray-700 font-medium leading-relaxed max-w-lg">
              {t("heroDesc")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/schemes"
                className="flex items-center justify-center gap-2 bg-blue-800 text-white px-8 py-3.5 rounded font-bold shadow hover:bg-blue-900 transition-colors w-full sm:w-auto"
              >
                {t("exploreSchemes")}
                <FiArrowRight className="text-xl" />
              </Link>

              <Link
                to="/register"
                className="flex items-center justify-center bg-white text-blue-900 px-8 py-3.5 rounded font-bold border-2 border-blue-900 hover:bg-blue-50 transition-colors w-full sm:w-auto"
              >
                {t("createAccount")}
              </Link>
            </div>
          </div>

          {/* Help & Support Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiInfo className="text-blue-800" /> {t("needHelp")}
            </h2>
            
            <p className="text-gray-700 mb-6 font-medium">
              {t("helpDesc")}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded">
                <div className="p-3 bg-green-100 text-green-800 rounded-full">
                  <FiPhoneCall size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{t("tollFree")}</p>
                  <p className="text-xl font-extrabold text-gray-900">1800-11-2233</p>
                  <p className="text-xs text-gray-500 mt-1">{t("availableTime")}</p>
                </div>
              </div>

              <Link 
                to="/help" 
                className="block text-center w-full py-3 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-300 transition-colors"
              >
                {t("findLocalSupport")} &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
import PageLayout from "../components/layout/PageLayout";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

function LocalHelp() {
  const { t } = useLanguage();

  const centers = [
    {
      name: "Main Block Panchayat Office",
      address: "123 Civic Center, Block A, District Headquarter",
      phone: "011-2345-6789",
      email: "block.panchayat@gov.in",
      officer: "Mr. Rajesh Kumar (BDO)",
    },
    {
      name: "Common Service Center (CSC) - North Zone",
      address: "Shop No. 12, Main Market Road, Near Post Office",
      phone: "98765-43210",
      email: "csc.north@gov.in",
      officer: "Ms. Sunita Sharma (VLE)",
    },
    {
      name: "Village Secretariat (Gram Sachivalaya)",
      address: "Gram Panchayat Bhavan, Sector 4",
      phone: "011-8765-4321",
      email: "gram.sachivalaya@gov.in",
      officer: "Mr. Amit Singh (Sarpanch)",
    },
  ];

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {t("localHelp")}
          </h1>
          <p className="mt-3 text-lg font-medium text-gray-600 max-w-3xl">
            {t("localHelpTitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Centers List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("supportDirectory")}</h2>
            {centers.map((center, index) => (
              <div key={index} className="solid-card p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded flex items-center justify-center">
                    <FiMapPin size={24} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{center.name}</h3>
                  <p className="mt-2 text-gray-700 flex items-start gap-2">
                    <span className="mt-1"><FiMapPin className="text-gray-400" /></span>
                    {center.address}
                  </p>
                  <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                    <p className="flex items-center gap-2 text-gray-700 font-medium">
                      <FiPhone className="text-gray-400" /> {center.phone}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700 font-medium">
                      <FiMail className="text-gray-400" /> {center.email}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-bold">{t("nodalOfficer")}:</span> {center.officer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Important Instructions sidebar */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded p-6">
              <h2 className="text-lg font-bold text-blue-900 mb-4">{t("beforeYouVisit")}</h2>
              <ul className="space-y-3 text-sm font-medium text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">&bull;</span> {t("carryAadhaar")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">&bull;</span> {t("bringPassbook")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">&bull;</span> {t("keepMobile")}
                </li>
              </ul>
            </div>

            <div className="solid-card p-6 border-t-4 border-t-yellow-500">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiClock className="text-yellow-600" /> {t("standardTimings")}
              </h2>
              <div className="space-y-2 text-sm text-gray-700 font-medium">
                <p className="flex justify-between"><span>{t("mondayFriday")}</span> <span>09:30 AM - 05:00 PM</span></p>
                <p className="flex justify-between"><span>{t("saturday")}</span> <span>09:30 AM - 01:00 PM</span></p>
                <p className="flex justify-between text-red-600"><span>{t("sunday")}</span> <span>{t("closed")}</span></p>
              </div>
              <p className="mt-4 text-xs text-gray-500 italic">
                * Note: CSCs may have extended working hours. Please call ahead to confirm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default LocalHelp;

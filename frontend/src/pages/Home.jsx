import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">How It Works</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { step: "1", title: "Register", desc: "Create your citizen account with basic details" },
            { step: "2", title: "Browse & Apply", desc: "Find welfare schemes and upload required documents" },
            { step: "3", title: "Track Status", desc: "Monitor your application status from your dashboard" },
          ].map(({ step, title, desc }) => (
            <div key={step} className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {step}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Home;

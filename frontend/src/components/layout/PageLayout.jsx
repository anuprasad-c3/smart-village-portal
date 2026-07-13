import Navbar from "./Navbar";
import Footer from "./Footer";

function PageLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">{children}</main>
      <Footer />
    </>
  );
}

export default PageLayout;

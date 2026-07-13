import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";

function NotFound() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-6xl font-bold text-blue-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mt-2 text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className="mt-8 inline-block">
          <Button>Go Home</Button>
        </Link>
      </div>
    </PageLayout>
  );
}

export default NotFound;

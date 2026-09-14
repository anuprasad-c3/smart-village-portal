import { Navigate } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { useAuth } from "../../hooks/useAuth";

function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }
  return children;
}

export default GuestRoute;

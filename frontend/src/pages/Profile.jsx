import PageLayout from "../components/layout/PageLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";

function ProfileContent() {
  const { user } = useAuth();

  const fields = [
    { label: "Full Name", value: user?.fullName },
    { label: "Email", value: user?.email },
    { label: "Phone", value: user?.phone },
    { label: "Address", value: user?.address },
    { label: "Role", value: user?.role },
  ];

  return (
    <PageLayout>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-500">Your account information</p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="space-y-6">
            {fields.map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-gray-900 capitalize">{value || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

export default Profile;

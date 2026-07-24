import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageLayout from "../components/layout/PageLayout";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { updateService } from "../services/updateService";
import { formatDate } from "../utils/formatDate";

function Updates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const { data } = await updateService.getAll();
      setUpdates(data.data);
    } catch {
      toast.error("Failed to load updates");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-6 py-12">

        <h1 className="text-3xl font-bold">
          Panchayat Updates
        </h1>

        <p className="mt-2 text-gray-500">
          Latest announcements, works and activities.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : updates.length === 0 ? (
          <EmptyState
            title="No Updates"
            description="No announcements available."
          />
        ) : (
          <div className="mt-8 space-y-5">

            {updates.map((item) => (

              <div
                key={item._id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >

                <p className="text-sm font-semibold text-green-700">
                  {formatDate(item.date)}
                </p>

                <p className="mt-2 text-gray-700 leading-relaxed">
                  {item.message}
                </p>

              </div>

            ))}

          </div>
        )}

      </div>
    </PageLayout>
  );
}

export default Updates;
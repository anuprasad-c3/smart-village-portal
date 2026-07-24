import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PageLayout from "../../components/layout/PageLayout";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

import { updateService } from "../../services/updateService";
import { formatDate } from "../../utils/formatDate";

const emptyForm = {
  date: "",
  message: "",
};

function ManageUpdatesContent() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);

  const fetchUpdates = async () => {
    setLoading(true);

    try {
      const { data } = await updateService.getAll();
      setUpdates(data.data);
    } catch {
      toast.error("Failed to load updates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      if (editingId) {
        await updateService.update(editingId, form);
        toast.success("Update edited successfully");
      } else {
        await updateService.create(form);
        toast.success("Update posted successfully");
      }

      resetForm();
      fetchUpdates();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      date: item.date.split("T")[0],
      message: item.message,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this update?")) return;

    try {
      await updateService.delete(id);

      toast.success("Update deleted");

      fetchUpdates();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-6 py-12">

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Manage Panchayat Updates
          </h1>

          <p className="mt-2 text-gray-500">
            Post announcements, project updates and public information.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >

          <div className="grid gap-5 md:grid-cols-2">

            <Input
              label="Date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

          </div>

          <div className="mt-5">

            <Textarea
              label="Update Message"
              rows={4}
              name="message"
              value={form.message}
              onChange={handleChange}
              required
            />

          </div>

          <div className="mt-6 flex gap-3">

            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update"
                : "Post Update"}
            </Button>

            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
            )}

          </div>

        </form>

        <div className="mt-10">

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : updates.length === 0 ? (
            <EmptyState
              title="No Updates"
              description="Post your first Panchayat update."
            />
          ) : (
            <div className="space-y-4">

              {updates.map((item) => (

                <div
                  key={item._id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >

                  <p className="font-semibold text-green-700">
                    {formatDate(item.date)}
                  </p>

                  <p className="mt-2 text-gray-700">
                    {item.message}
                  </p>

                  <div className="mt-4 flex gap-2">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </Button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </PageLayout>
  );
}

export default function ManageUpdates() {
  return (
    <ProtectedRoute adminOnly>
      <ManageUpdatesContent />
    </ProtectedRoute>
  );
}
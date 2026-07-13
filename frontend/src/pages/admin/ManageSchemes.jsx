import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageLayout from "../../components/layout/PageLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import Spinner from "../../components/ui/Spinner";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { schemeService } from "../../services/schemeService";
import { SCHEME_CATEGORIES, SCHEME_STATUSES } from "../../constants/schemeCategories";
import { formatDate } from "../../utils/formatDate";

const emptyForm = {
  title: "",
  category: "Agriculture",
  description: "",
  eligibility: "",
  requiredDocuments: "",
  benefits: "",
  department: "",
  lastDate: "",
  status: "Active",
};

function parseLines(text) {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

function ManageSchemesContent() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSchemes = () => {
    setLoading(true);
    schemeService
      .getAll({ limit: 100 })
      .then((res) => setSchemes(res.data.data))
      .catch(() => toast.error("Failed to load schemes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (scheme) => {
    setForm({
      title: scheme.title,
      category: scheme.category,
      description: scheme.description,
      eligibility: scheme.eligibility?.join("\n") || "",
      requiredDocuments: scheme.requiredDocuments?.join("\n") || "",
      benefits: scheme.benefits?.join("\n") || "",
      department: scheme.department || "",
      lastDate: scheme.lastDate ? scheme.lastDate.split("T")[0] : "",
      status: scheme.status,
    });
    setEditingId(scheme._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      eligibility: parseLines(form.eligibility),
      requiredDocuments: parseLines(form.requiredDocuments),
      benefits: parseLines(form.benefits),
      department: form.department,
      lastDate: form.lastDate,
      status: form.status,
    };

    try {
      if (editingId) {
        await schemeService.update(editingId, payload);
        toast.success("Scheme updated");
      } else {
        await schemeService.create(payload);
        toast.success("Scheme created");
      }
      resetForm();
      fetchSchemes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save scheme");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scheme?")) return;
    try {
      await schemeService.delete(id);
      toast.success("Scheme deleted");
      fetchSchemes();
    } catch {
      toast.error("Failed to delete scheme");
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Schemes</h1>
            <p className="mt-2 text-gray-500">Create, edit, and delete welfare schemes</p>
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            Add New Scheme
          </Button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? "Edit Scheme" : "New Scheme"}
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
              <Select label="Category" name="category" value={form.category} onChange={handleChange}>
                {SCHEME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
              <Input label="Department" name="department" value={form.department} onChange={handleChange} />
              <Input label="Last Date" type="date" name="lastDate" value={form.lastDate} onChange={handleChange} required />
              <Select label="Status" name="status" value={form.status} onChange={handleChange}>
                {SCHEME_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>

            <Textarea
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-5"
              required
            />

            <Textarea
              label="Eligibility (one per line)"
              name="eligibility"
              value={form.eligibility}
              onChange={handleChange}
              className="mt-5"
              required
            />

            <Textarea
              label="Required Documents (one per line)"
              name="requiredDocuments"
              value={form.requiredDocuments}
              onChange={handleChange}
              className="mt-5"
              required
            />

            <Textarea
              label="Benefits (one per line)"
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              className="mt-5"
            />

            <div className="mt-6 flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Scheme" : "Create Scheme"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : schemes.length === 0 ? (
          <EmptyState title="No schemes yet" description="Create your first welfare scheme" />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Last Date</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map((scheme) => (
                  <tr key={scheme._id} className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium text-gray-900">{scheme.title}</td>
                    <td className="px-6 py-4 text-gray-600">{scheme.category}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(scheme.lastDate)}</td>
                    <td className="px-6 py-4"><StatusBadge status={scheme.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(scheme)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(scheme._id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function ManageSchemes() {
  return (
    <ProtectedRoute adminOnly>
      <ManageSchemesContent />
    </ProtectedRoute>
  );
}

export default ManageSchemes;

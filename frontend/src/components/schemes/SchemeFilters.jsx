import Input from "../ui/Input";
import Select from "../ui/Select";
import { SCHEME_CATEGORIES } from "../../constants/schemeCategories";

function SchemeFilters({ search, category, status, onSearchChange, onCategoryChange, onStatusChange }) {
  return (
    <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-3">
      <Input
        label="Search"
        placeholder="Search schemes..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <Select label="Category" value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">All Categories</option>
        {SCHEME_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </Select>

      <Select label="Status" value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </Select>
    </div>
  );
}

export default SchemeFilters;

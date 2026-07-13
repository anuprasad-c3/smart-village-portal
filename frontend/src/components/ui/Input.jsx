function Input({ label, error, id, className = "", ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-gray-900">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded border bg-white px-4 py-2.5 text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-800 focus:ring-2 focus:ring-blue-800 focus:ring-offset-1 ${
          error ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

export default Input;

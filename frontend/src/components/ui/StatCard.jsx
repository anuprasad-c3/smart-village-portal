function StatCard({ title, value, icon: Icon, color = "blue" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-green-100 text-green-800 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <div className="solid-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-600 tracking-wide uppercase">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className={`rounded p-3 border ${colors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;

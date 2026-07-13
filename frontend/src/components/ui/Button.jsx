function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-blue-800 text-white shadow-sm hover:bg-blue-900 focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:opacity-50",
    secondary: "bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:opacity-50",
    danger: "bg-red-700 text-white shadow-sm hover:bg-red-800 focus:ring-2 focus:ring-red-700 focus:ring-offset-2 disabled:opacity-50",
    outline: "border-2 border-blue-800 text-blue-800 hover:bg-blue-50 focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:opacity-50",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-blue-800 focus:ring-2 focus:ring-gray-300 disabled:opacity-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-6 py-3 text-lg font-semibold",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded font-medium transition-colors duration-150 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

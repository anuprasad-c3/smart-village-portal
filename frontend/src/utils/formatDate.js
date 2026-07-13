export function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function isPastDate(date) {
  if (!date) return false;
  return new Date(date) < new Date();
}

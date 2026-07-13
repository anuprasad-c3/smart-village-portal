export const SERVER_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

export function getUploadUrl(filePath) {
  if (!filePath) return "";
  if (filePath.startsWith("http")) return filePath;
  return `${SERVER_BASE}${filePath}`;
}

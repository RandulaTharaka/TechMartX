// frontend/src/utils/media.js
export function getImageUrl(imagePath) {
  if (!imagePath) return "";

  // If already an HTTP/HTTPS URL, return as-is
  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  // Normalize path separators
  let p = imagePath.replace(/\\/g, "/");

  // Remove accidental leading '/backend' prefix
  p = p.replace(/^\/?backend/i, "");

  // Ensure we have a leading slash
  if (!p.startsWith("/")) p = "/" + p;

  // Prepend the backend base URL if set
  const backend = (
    process.env.REACT_APP_API_URL || "https://techmartx.onrender.com"
  ).replace(/\/$/, "");
  return backend ? `${backend}${p}` : p;
}

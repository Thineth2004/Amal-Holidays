// Replace process.env with import.meta.env
export const backend_url = (import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api";
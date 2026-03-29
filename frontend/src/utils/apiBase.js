// Central API base URL resolver.
// In development, Vite proxy handles /api → localhost:5000, so BASE = ''.
// In production (Vercel), VITE_API_URL points to the backend deployment.
const BASE_URL = import.meta.env.VITE_API_URL || '';

export default BASE_URL;

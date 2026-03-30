// Central API base URL resolver.
const VITE_API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = VITE_API_URL || '';

if (import.meta.env.PROD && !VITE_API_URL) {
    console.warn('VITE_API_URL is not defined. API calls will default to the current domain path.');
}

export default BASE_URL;

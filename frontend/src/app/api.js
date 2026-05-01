// Dynamic API base URL helper – depends on current hostname
export const getApiBaseUrl = () => {
    if (typeof window === 'undefined') return '';

    const { protocol, hostname, port } = window.location;

    // Local development – point to local backend if not serving from same port
    // If you're using Vite dev server (usually port 5173), it needs to point to 3000
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port === '5173') {
        return `${protocol}//${hostname}:3000/api/v1`;
    }

    // In production/docker, we usually serve frontend and backend from the same port
    // Or we use a proxy. Using current origin is the most portable way.
    return `${window.location.origin}/api/v1`;
};

// Default exported base URL used across the app
export const API_URL = getApiBaseUrl();
console.log('[API_URL] Exported API_URL:', API_URL);


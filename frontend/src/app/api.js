// Dynamic API base URL helper – depends on current hostname
export const getApiBaseUrl = () => {
    if (typeof window === 'undefined') return '';

    // Use current origin in production/docker
    if (window.location.port !== '5173') {
        return `${window.location.origin}/api/v1`;
    }

    // Local Vite development fallback
    return `${window.location.protocol}//${window.location.hostname}:3000/api/v1`;
};

// Default exported base URL used across the app
export const API_URL = getApiBaseUrl();
console.log('[API_URL] Exported API_URL:', API_URL);


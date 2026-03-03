// Dynamic API base URL helper – depends on current hostname
export const getApiBaseUrl = () => {
    // If explicit env is set, always prefer that (for staging/override)
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    if (typeof window === 'undefined') {
        // Fallback for non-browser environments
        return '';
    }

    const { protocol, hostname, port } = window.location;

    // Local development – point to local backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Change 3000 if your Node backend listens on another port
        return `${protocol}//localhost:3000/api/v1`;
    }

    const parts = hostname.split('.');
    let newHost;

    if (parts.length > 2) {
        // Has subdomain → remove first part (e.g. crm.cloudedata.in → api.cloudedata.in)
        const rootDomain = parts.slice(1).join('.');
        newHost = `api.${rootDomain}`;
    } else {
        // No subdomain → just add api. (e.g. cloudedata.in → api.cloudedata.in)
        newHost = `api.${hostname}`;
    }

    const finalDomain = `${protocol}//${newHost}${port ? `:${port}` : ''}`;

    // All backend routes are under /api/v1
    return `${finalDomain}/api/v1`;
};

// Default exported base URL used across the app
export const API_URL = getApiBaseUrl();


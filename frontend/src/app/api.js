// Dynamic API base URL helper – depends on current hostname
export const getApiBaseUrl = () => {
    console.log('[API_URL] getApiBaseUrl called');

    // If explicit env is set, always prefer that (for staging/override)
    if (import.meta.env.VITE_API_URL) {
        console.log('[API_URL] Using VITE_API_URL from env:', import.meta.env.VITE_API_URL);
        return import.meta.env.VITE_API_URL;
    }

    if (typeof window === 'undefined') {
        // Fallback for non-browser environments
        console.log('[API_URL] window is undefined – returning empty string');
        return '';
    }

    const { protocol, hostname, port } = window.location;
    console.log('[API_URL] window location:', { protocol, hostname, port });

    // Local development – point to local backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Change 3000 if your Node backend listens on another port
        const localUrl = `${protocol}//localhost:3000/api/v1`;
        console.log('[API_URL] Detected localhost – using local backend URL:', localUrl);
        return localUrl;
    }

    const parts = hostname.split('.');
    console.log('[API_URL] Hostname parts:', parts);

    let newHost;

    if (parts.length > 2) {
        // Has subdomain → remove first part (e.g. crm.cloudedata.in → api.cloudedata.in)
        const rootDomain = parts.slice(1).join('.');
        newHost = `api.${rootDomain}`;
        console.log('[API_URL] Detected subdomain. Root domain:', rootDomain, 'New host:', newHost);
    } else {
        // No subdomain → just add api. (e.g. cloudedata.in → api.cloudedata.in)
        newHost = `api.${hostname}`;
        console.log('[API_URL] No subdomain. New host:', newHost);
    }

    const finalDomain = `${protocol}//${newHost}${port ? `:${port}` : ''}`;
    const finalUrl = `${finalDomain}/api/v1`;

    // All backend routes are under /api/v1
    console.log('[API_URL] Final API base URL:', finalUrl);
    return finalUrl;
};

// Default exported base URL used across the app
export const API_URL = getApiBaseUrl();
console.log('[API_URL] Exported API_URL:', API_URL);


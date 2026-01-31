// transport.api.js - Staff Module Transport API Service
// This service will be used for backend integration

// Mock data for initial setup (will be replaced with actual API calls)
const MOCK_ROUTES = [
    { id: 'RT-001', name: 'Route 1: City Center', bus: 'DL-1PC-4502', driver: 'Ramesh Singh', status: 'Active', students: 25 },
    { id: 'RT-002', name: 'Route 2: South Extension', bus: 'DL-1PC-4503', driver: 'Sunil Yadav', status: 'Active', students: 20 },
    { id: 'RT-003', name: 'Route 3: West Delhi', bus: 'DL-1PC-4504', driver: 'Rajan Kumar', status: 'Inactive', students: 0 },
];

const MOCK_ASSETS = [
    { id: 'AST-001', name: 'School Bus 01', type: 'Vehicle', code: 'BUS-01', status: 'Active', assignedTo: 'Ramesh Singh' },
    { id: 'AST-002', name: 'School Bus 02', type: 'Vehicle', code: 'BUS-02', status: 'Active', assignedTo: 'Sunil Yadav' },
    { id: 'AST-003', name: 'Projector - Room 101', type: 'Electronics', code: 'PROJ-101', status: 'Under Maintenance', assignedTo: 'IT Dept' },
];

/**
 * Fetch all routes
 * @returns {Promise<Array>} List of routes
 */
export const fetchRoutes = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_ROUTES), 300);
    });
};

/**
 * Fetch route by ID
 * @param {string} routeId - Route ID
 * @returns {Promise<Object|null>} Route object or null
 */
export const fetchRouteById = async (routeId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const route = MOCK_ROUTES.find(r => r.id === routeId);
            resolve(route || null);
        }, 300);
    });
};

/**
 * Fetch all assets
 * @returns {Promise<Array>} List of assets
 */
export const fetchAssets = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_ASSETS), 300);
    });
};

/**
 * Fetch asset by ID
 * @param {string} assetId - Asset ID
 * @returns {Promise<Object|null>} Asset object or null
 */
export const fetchAssetById = async (assetId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const asset = MOCK_ASSETS.find(a => a.id === assetId);
            resolve(asset || null);
        }, 300);
    });
};

export default {
    fetchRoutes,
    fetchRouteById,
    fetchAssets,
    fetchAssetById,
};
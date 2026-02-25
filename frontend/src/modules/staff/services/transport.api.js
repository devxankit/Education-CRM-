import axios from 'axios';
import { API_URL } from '@/app/api';

const getAuthHeaders = () => {
    try {
        const staffUser = JSON.parse(localStorage.getItem('staff_user') || 'null');
        if (staffUser && staffUser.token) {
            return { headers: { Authorization: `Bearer ${staffUser.token}` } };
        }
    } catch (e) {
        console.error('Error parsing staff_user for token', e);
    }
    return { headers: {} };
};

/**
 * Fetch transport summary (active routes, buses, students, issues)
 * @param {string} [branchId] - Optional branch filter
 * @returns {Promise<{ activeRoutes, totalRoutes, totalBuses, studentsAssigned, openIssues }|null>}
 */
export const getTransportSummary = async (branchId) => {
    try {
        const params = branchId && branchId !== 'all' ? { branchId } : {};
        const response = await axios.get(`${API_URL}/staff/transport/summary`, {
            ...getAuthHeaders(),
            params,
        });
        if (response.data.success) return response.data.data;
        return null;
    } catch (error) {
        console.error('Error fetching transport summary:', error);
        return null;
    }
};

/**
 * Fetch all transport routes
 * @param {string} [branchId] - Optional branch filter
 * @returns {Promise<Array>} List of routes
 */
export const fetchRoutes = async (branchId) => {
    try {
        const params = branchId && branchId !== 'all' ? { branchId } : {};
        const response = await axios.get(`${API_URL}/staff/transport/routes`, {
            ...getAuthHeaders(),
            params,
        });
        if (response.data.success) return response.data.data || [];
        return [];
    } catch (error) {
        console.error('Error fetching transport routes:', error);
        return [];
    }
};

/**
 * Fetch single route by ID (from list or backend if you add GET :id later)
 * @param {string} routeId
 * @returns {Promise<Object|null>}
 */
export const fetchRouteById = async (routeId) => {
    try {
        const list = await fetchRoutes();
        const route = (list || []).find((r) => (r._id || r.id) === routeId);
        return route || null;
    } catch (error) {
        console.error('Error fetching route by id:', error);
        return null;
    }
};

/**
 * Fetch branches for transport filter (reuse staff branches)
 */
export const fetchBranches = async () => {
    try {
        const response = await axios.get(`${API_URL}/staff/branches`, getAuthHeaders());
        if (response.data.success && response.data.data?.branches) {
            return response.data.data.branches;
        }
        return [];
    } catch (error) {
        console.error('Error fetching branches:', error);
        return [];
    }
};

/**
 * Fetch students who have opted for transport
 * @param {string} [branchId]
 * @returns {Promise<Array>}
 */
export const fetchTransportStudents = async (branchId) => {
    try {
        const params = branchId && branchId !== 'all' ? { branchId } : {};
        const response = await axios.get(`${API_URL}/staff/transport/students`, {
            ...getAuthHeaders(),
            params,
        });
        if (response.data.success) return response.data.data || [];
        return [];
    } catch (error) {
        console.error('Error fetching transport students:', error);
        return [];
    }
};
/**
 * Fetch transport drivers (for staff Drivers page)
 * @param {string} [branchId] - Optional branch filter
 * @returns {Promise<Array>} List of drivers
 */
export const fetchDrivers = async (branchId) => {
    try {
        const params = branchId && branchId !== 'all' ? { branchId } : {};
        const response = await axios.get(`${API_URL}/transport-driver`, {
            ...getAuthHeaders(),
            params,
        });
        if (response.data.success) return response.data.data || [];
        return [];
    } catch (error) {
        console.error('Error fetching transport drivers:', error);
        return [];
    }
};

/**
 * Fetch single driver with assigned routes
 * @param {string} driverId
 * @returns {Promise<{driver: object, routes: Array}|null>}
 */
export const fetchDriverDetails = async (driverId) => {
    try {
        const response = await axios.get(`${API_URL}/transport-driver/${driverId}`, getAuthHeaders());
        if (response.data.success) return response.data.data;
        return null;
    } catch (error) {
        console.error('Error fetching driver details:', error);
        return null;
    }
};

export default {
    getTransportSummary,
    fetchRoutes,
    fetchRouteById,
    fetchBranches,
    fetchDrivers,
    fetchDriverDetails,
    fetchTransportStudents,
};


import axios from 'axios';
import { API_URL } from '../../../app/api';


/**
 * Login staff member
 * @param {string} email - Staff email/ID
 * @param {string} password - Password
 * @param {string} role - Selected role
 * @returns {Promise<Object>} User object and token
 */
export const loginStaff = async (email, password, role) => {
    try {
        const response = await axios.post(`${API_URL}/staff/login`, {
            email,
            password,
            role
        });

        if (response.data.success) {
            if (response.data.requires2FA && response.data.tempToken) {
                return {
                    requires2FA: true,
                    tempToken: response.data.tempToken,
                    message: response.data.message || 'OTP sent to your email'
                };
            }
            if (!response.data.token) {
                throw new Error(response.data.message || 'Login failed');
            }
            return {
                user: response.data.data,
                token: response.data.token
            };
        } else {
            throw new Error(response.data.message || 'Login failed');
        }
    } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Login failed';
        throw typeof msg === 'string' ? msg : 'Login failed';
    }
};

/**
 * Request password reset OTP (forgot password)
 * @param {string} email - Staff email
 * @returns {Promise<{ success: boolean, message?: string, email?: string }>}
 */
export const requestStaffPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/staff/forgot-password`, { email: email?.trim() });
        if (response.data.success) {
            return { success: true, message: response.data.message, email: response.data.email };
        }
        return { success: false, message: response.data.message || 'Failed to send OTP' };
    } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Failed to send OTP';
        return { success: false, message: msg };
    }
};

/**
 * Verify forgot-password OTP (before showing new password screen)
 * @param {string} email - Staff email
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export const verifyStaffForgotOtp = async (email, otp) => {
    try {
        const response = await axios.post(`${API_URL}/staff/verify-forgot-otp`, {
            email: email?.trim(),
            otp: String(otp).trim()
        });
        if (response.data.success) {
            return { success: true, message: response.data.message };
        }
        return { success: false, message: response.data.message || 'Invalid OTP' };
    } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Invalid or expired OTP';
        return { success: false, message: msg };
    }
};

/**
 * Reset staff password with OTP
 * @param {string} email - Staff email
 * @param {string} otp - 6-digit OTP
 * @param {string} newPassword - New password
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export const resetStaffPasswordWithOtp = async (email, otp, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/staff/reset-password`, {
            email: email?.trim(),
            otp: String(otp).trim(),
            newPassword
        });
        if (response.data.success) {
            return { success: true, message: response.data.message };
        }
        return { success: false, message: response.data.message || 'Failed to reset password' };
    } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Failed to reset password';
        return { success: false, message: msg };
    }
};

export const verifyOtpStaff = async (tempToken, otp, role) => {
    try {
        const response = await axios.post(`${API_URL}/staff/verify-otp`, {
            tempToken,
            otp,
            role
        });

        if (response.data.success) {
            if (!response.data.token) {
                throw new Error(response.data.message || 'Verification failed');
            }
            return {
                user: response.data.data,
                token: response.data.token
            };
        } else {
            throw new Error(response.data.message || 'Verification failed');
        }
    } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Invalid OTP';
        throw typeof msg === 'string' ? msg : 'Invalid OTP';
    }
};

/**
 * Fetch available roles for login dropdown
 * @returns {Promise<Array>} List of roles
 */
export const getPublicRoles = async () => {
    try {
        const response = await axios.get(`${API_URL}/role/public`);
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch roles:", error);
        return [];
    }
};

/**
 * Fetch role details by ID to get fresh permissions
 * @param {string} id - Role ID
 * @returns {Promise<Object>} Role object with permissions
 */
export const getRoleById = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await axios.get(`${API_URL}/role/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch role:", error);
        return null;
    }
};

/**
 * Fetch permissions for the currently logged-in staff member
 * @returns {Promise<Object>} Permissions object
 */
export const getMyPermissions = async () => {
    try {
        let token = localStorage.getItem('token');

        // Fallback: Check staff_user in localStorage if global token missing
        if (!token) {
            try {
                const staffUser = JSON.parse(localStorage.getItem('staff_user') || 'null');
                if (staffUser && staffUser.token) {
                    token = staffUser.token;
                }
            } catch (e) {
                console.error("Error parsing staff_user", e);
            }
        }

        if (!token) {
            console.warn("No token found for permissions fetch");
            return {};
        }

        const response = await axios.get(`${API_URL}/staff/permissions`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
            return response.data.data;
        }
        return {};
    } catch (error) {
        console.error("Failed to fetch permissions:", error);
        return {};
    }
};

export default {
    loginStaff,
    getMyPermissions
};

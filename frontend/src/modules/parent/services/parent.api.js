// parent.api.js - Parent Module API Service
// Uses parentStore for live data; this file kept for potential direct API usage
// All pages use parentStore - no mock data

import { API_URL } from '../../../app/api';
import axios from 'axios';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getDashboard = async () => {
    const res = await axios.get(`${API_URL}/parent/portal/dashboard`, {
        headers: getAuthHeader()
    });
    return res.data?.success ? res.data.data : null;
};

export const getProfile = async () => {
    const res = await axios.get(`${API_URL}/parent/portal/profile`, {
        headers: getAuthHeader()
    });
    return res.data?.success ? res.data.data : null;
};

export const updateProfile = async (profileData) => {
    const res = await axios.put(`${API_URL}/parent/portal/profile`, profileData, {
        headers: getAuthHeader()
    });
    return res.data?.success ? { success: true, data: res.data.data } : { success: false };
};

export const getSettings = async () => {
    return {
        notifications: { attendance: true, homework: true, fees: true, notices: true },
        privacy: { showPhone: true, showEmail: true },
        appearance: { darkMode: false, language: 'English' }
    };
};

export const updateSettings = async (settings) => {
    return { success: true, data: settings };
};

export const ParentService = {
    getDashboard,
    getProfile,
    updateProfile,
    getSettings,
    updateSettings,
};

export default ParentService;

// notices.api.js - Parent Module Notices API Service
// All pages use parentStore - this file kept for potential direct API usage
// No mock data - uses API

import { API_URL } from '../../../app/api';
import axios from 'axios';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getNotices = async () => {
    const res = await axios.get(`${API_URL}/parent/portal/notices`, {
        headers: getAuthHeader()
    });
    return res.data?.success ? res.data.data : [];
};

export const getNoticeById = async (noticeId) => {
    const notices = await getNotices();
    return notices.find(n => (n._id || n.id)?.toString() === noticeId?.toString()) || null;
};

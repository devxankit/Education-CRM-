// children.api.js - Parent Module Children API Service
// All pages use parentStore - this file kept for potential direct API usage
// No mock data - uses parentStore or API

import { API_URL } from '../../../app/api';
import axios from 'axios';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getLinkedStudents = async (parentId) => {
    const res = await axios.get(`${API_URL}/parent/${parentId}/linked-students`, {
        headers: getAuthHeader()
    });
    return res.data?.success ? res.data.data : [];
};

export const getChildById = async (parentId, childId) => {
    const students = await getLinkedStudents(parentId);
    return students.find(s => (s._id || s.id)?.toString() === childId?.toString()) || null;
};

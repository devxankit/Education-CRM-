/**
 * Teacher Profile API Service
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockProfile = {
    id: 'TCH-001',
    name: 'Suresh Kumar',
    email: 'suresh.k@school.edu',
    phone: '+91 9876543210',
    department: 'Mathematics',
    designation: 'Senior Teacher',
    joiningDate: '2020-06-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh'
};

export const getTeacherProfile = async () => {
    await delay(300);
    return { success: true, data: mockProfile };
};

export const updateProfile = async (data) => {
    await delay(500);
    return { success: true, data: { ...mockProfile, ...data } };
};

export default {
    getTeacherProfile,
    updateProfile
};

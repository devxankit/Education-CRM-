/**
 * Subject API Service for Teacher Module
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockSubjects = [
    { id: 'SUB-MATH', name: 'Mathematics', code: 'MATH101' },
    { id: 'SUB-PHYS', name: 'Physics', code: 'PHYS101' },
    { id: 'SUB-CHEM', name: 'Chemistry', code: 'CHEM101' }
];

export const getAssignedSubjects = async () => {
    await delay(300);
    return { success: true, data: mockSubjects };
};

export default {
    getAssignedSubjects
};

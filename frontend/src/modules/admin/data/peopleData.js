/**
 * People Mock Data for Admin Module
 */

export const initialEmployees = [
    { id: 'EMP-1001', firstName: 'Rajesh', lastName: 'Kumar', type: 'Full-time', designation: 'Accountant', department: 'Finance', phone: '9876543210', status: 'Active' },
    { id: 'EMP-1002', firstName: 'Sunita', lastName: 'Sharma', type: 'Full-time', designation: 'Admin Assistant', department: 'Office', phone: '9876543211', status: 'Active' },
    { id: 'EMP-1003', firstName: 'Vikram', lastName: 'Singh', type: 'Part-time', designation: 'Security Head', department: 'Security', phone: '9876543212', status: 'Active' },
];

export const initialTeachers = [
    { id: 'TCH-1001', firstName: 'John', lastName: 'Doe', employeeId: 'EMP-1023', department: 'Science', designation: 'Physics Lecturer', academicLevel: 'School', status: 'Active' },
    { id: 'TCH-1002', firstName: 'Emily', lastName: 'Davis', employeeId: 'EMP-1050', department: 'Mathematics', designation: 'Math Teacher', academicLevel: 'School', status: 'Active' },
    { id: 'TCH-1003', firstName: 'Alan', lastName: 'Turing', employeeId: 'EMP-3001', department: 'Computer Science', designation: 'HOD', academicLevel: 'UG', status: 'Active' },
];

export default {
    initialEmployees,
    initialTeachers
};

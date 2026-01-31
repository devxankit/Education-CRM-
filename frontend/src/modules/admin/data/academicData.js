/**
 * Academic Mock Data for Admin Module
 * Classes, Sections, etc.
 */

export const initialClasses = [
    { id: '1', name: 'Class 10', status: 'active', sections: 4, students: 160 },
    { id: '2', name: 'Class 9', status: 'active', sections: 3, students: 120 },
    { id: '3', name: 'Class 8', status: 'active', sections: 5, students: 200 },
    { id: '4', name: 'Class 11 - Science', status: 'active', sections: 2, students: 70 },
];

export const initialSections = {
    '1': [
        { id: '1-A', name: 'Section A', capacity: 40, students: 38, teacher: 'Suresh Kumar', status: 'active' },
        { id: '1-B', name: 'Section B', capacity: 40, students: 40, teacher: 'Priya Verma', status: 'active' },
        { id: '1-C', name: 'Section C', capacity: 40, students: 42, teacher: 'Amit Shah', status: 'active' },
    ],
    '2': [
        { id: '2-A', name: 'Section A', capacity: 40, students: 35, teacher: 'Sunil Yadav', status: 'active' },
    ]
};

export default {
    initialClasses,
    initialSections
};

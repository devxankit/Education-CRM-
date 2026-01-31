
// Mock data for Academics page

export const classInfo = {
    className: 'Class 10',
    section: 'A',
    academicYear: '2025-26',
    medium: 'English',
    stream: 'Science',
    classTeacher: 'Mr. Rajesh Sharma'
};

export const subjects = [
    { id: 1, name: 'Mathematics', teacher: 'Mr. Rajesh Sharma', code: 'MATH101', classesPerWeek: 6, color: 'text-blue-600 bg-blue-50' },
    { id: 2, name: 'Physics', teacher: 'Ms. Anjali Verma', code: 'PHY101', classesPerWeek: 4, color: 'text-purple-600 bg-purple-50' },
    { id: 3, name: 'Chemistry', teacher: 'Mr. Suresh Patel', code: 'CHEM101', classesPerWeek: 4, color: 'text-teal-600 bg-teal-50' },
    { id: 4, name: 'English', teacher: 'Mrs. Kavita Das', code: 'ENG101', classesPerWeek: 5, color: 'text-pink-600 bg-pink-50' },
    { id: 5, name: 'Computer Science', teacher: 'Mr. Amit Kumar', code: 'CS101', classesPerWeek: 3, color: 'text-indigo-600 bg-indigo-50' },
    { id: 6, name: 'Social Studies', teacher: 'Mrs. Meena Rao', code: 'SST101', classesPerWeek: 4, color: 'text-orange-600 bg-orange-50' },
];

export const timetable = {
    Mon: [
        { id: 1, time: '09:00 AM - 10:00 AM', subject: 'Mathematics', teacher: 'Mr. Rajesh Sharma', room: '101', type: 'offline' },
        { id: 2, time: '10:15 AM - 11:15 AM', subject: 'Physics', teacher: 'Ms. Anjali Verma', room: 'Lab 2', type: 'offline' },
        { id: 3, time: '11:30 AM - 12:30 PM', subject: 'English', teacher: 'Mrs. Kavita Das', room: '101', type: 'offline' },
        { id: 4, time: '01:30 PM - 02:30 PM', subject: 'Chemistry', teacher: 'Mr. Suresh Patel', room: '101', type: 'offline' },
    ],
    Tue: [
        { id: 1, time: '09:00 AM - 10:00 AM', subject: 'Social Studies', teacher: 'Mrs. Meena Rao', room: '101', type: 'offline' },
        { id: 2, time: '10:15 AM - 11:15 AM', subject: 'Mathematics', teacher: 'Mr. Rajesh Sharma', room: '101', type: 'offline' },
        { id: 3, time: '11:30 AM - 12:30 PM', subject: 'Computer Science', teacher: 'Mr. Amit Kumar', link: 'https://meet.google.com/abc', type: 'online' },
    ],
    Wed: [
        { id: 1, time: '09:00 AM - 10:00 AM', subject: 'Physics', teacher: 'Ms. Anjali Verma', room: 'Lab 2', type: 'offline' },
        { id: 2, time: '10:15 AM - 11:15 AM', subject: 'Mathematics', teacher: 'Mr. Rajesh Sharma', room: '101', type: 'offline' },
        { id: 3, time: '11:30 AM - 12:30 PM', subject: 'Chemistry', teacher: 'Mr. Suresh Patel', room: 'Lab 3', type: 'offline' },
    ],
    Thu: [
        { id: 1, time: '09:00 AM - 10:00 AM', subject: 'English', teacher: 'Mrs. Kavita Das', room: '101', type: 'offline' },
        { id: 2, time: '10:15 AM - 11:15 AM', subject: 'Social Studies', teacher: 'Mrs. Meena Rao', room: '101', type: 'offline' },
        { id: 3, time: '11:30 AM - 12:30 PM', subject: 'Mathematics', teacher: 'Mr. Rajesh Sharma', room: '101', type: 'offline' },
    ],
    Fri: [
        { id: 1, time: '09:00 AM - 10:00 AM', subject: 'Mathematics', teacher: 'Mr. Rajesh Sharma', room: '101', type: 'offline' },
        { id: 2, time: '10:15 AM - 11:15 AM', subject: 'Computer Science', teacher: 'Mr. Amit Kumar', room: 'CS Lab', type: 'offline' },
        { id: 3, time: '11:30 AM - 12:30 PM', subject: 'Physics', teacher: 'Ms. Anjali Verma', room: '101', type: 'offline' },
    ],
    Sat: [] // Holiday example
};

export const academicsData = {
    classInfo,
    subjects,
    timetable
};


// Centralized Mock Data for Parent Module
// This file contains all mock data that was previously inline in page components

// ====================================
// PARENT USER DATA (from mockData.js)
// ====================================
export const MOCK_PARENT_DATA = {
    user: {
        id: 'P001',
        name: 'Mr. Rajesh Verma',
        avatar: 'https://ui-avatars.com/api/?name=Rajesh+Verma&background=0D8ABC&color=fff'
    },
    children: [
        {
            id: 'S001',
            name: 'Arav Verma',
            class: '10th',
            section: 'A',
            avatar: null, // use placeholder
            rollNo: '24',
            status: 'On Track', // On Track, Attention Needed, Action Required
            alerts: [
                { id: 1, type: 'homework', icon: 'BookOpen', title: 'Math Homework Due', message: 'Chapter 4 Exercises due tomorrow', cta: 'View' },
                { id: 2, type: 'fee', icon: 'CreditCard', title: 'Fee Due Soon', message: 'Q3 Tuition Fee is due in 5 days', cta: 'Pay Now' }
            ],
            academics: {
                attendance: 88,
                homeworkPending: 2,
                lastResult: { subject: 'Physics', marks: '42/50', grade: 'A' }
            },
            fees: {
                total: 45000,
                paid: 30000,
                pending: 15000,
                dueDate: '2023-10-30'
            }
        },
        {
            id: 'S002',
            name: 'Sneha Verma',
            class: '6th',
            section: 'B',
            avatar: null,
            rollNo: '12',
            status: 'Attention Needed',
            alerts: [
                { id: 3, type: 'attendance', icon: 'Clock', title: 'Low Attendance', message: 'Attendance dropped below 75%', cta: 'Check' }
            ],
            academics: {
                attendance: 72,
                homeworkPending: 0,
                lastResult: { subject: 'English', marks: '35/50', grade: 'B' }
            },
            fees: {
                total: 45000,
                paid: 45000,
                pending: 0,
                dueDate: null
            }
        }
    ],
    notices: [
        { id: 1, title: 'Annual Sports Day', date: '2023-10-25', description: 'Annual sports day will be held on 15th Nov.' },
        { id: 2, title: 'Diwali Holidays', date: '2023-10-20', description: 'School closed from Nov 10 to Nov 15.' }
    ]
};

// ====================================
// FEES DATA (from FeesPayments.jsx)
// ====================================
export const MOCK_FEES = {
    summary: {
        total: 125000,
        paid: 75000,
        pending: 50000,
        nextDue: '2023-11-15'
    },
    breakdown: [
        {
            id: 1,
            head: 'Tuition Fee',
            total: 80000,
            paid: 40000,
            pending: 40000,
            status: 'Partial',
            installments: [
                { term: 'Term 1', amount: 40000, due: '2023-04-10', status: 'Paid', mode: 'Bank Transfer' },
                { term: 'Term 2', amount: 40000, due: '2023-10-10', status: 'Overdue', mode: null }
            ]
        },
        {
            id: 2,
            head: 'Annual Charges',
            total: 25000,
            paid: 25000,
            pending: 0,
            status: 'Paid',
            installments: [
                { term: 'Annual', amount: 25000, due: '2023-04-10', status: 'Paid', mode: 'Online' }
            ]
        },
        {
            id: 3,
            head: 'Transport Fee',
            total: 20000,
            paid: 10000,
            pending: 10000,
            status: 'Due',
            installments: [
                { term: 'Term 1', amount: 10000, due: '2023-04-10', status: 'Paid', mode: 'Cheque' },
                { term: 'Term 2', amount: 10000, due: '2023-10-10', status: 'Due', mode: null }
            ]
        }
    ],
    receipts: [
        { id: 'REC-101', date: '2023-04-15', amount: 65000, mode: 'Online Transfer' },
        { id: 'REC-102', date: '2023-04-12', amount: 10000, mode: 'Cheque' }
    ]
};

// ====================================
// ATTENDANCE DATA (from Attendance.jsx)
// ====================================
export const MOCK_ATTENDANCE = {
    overall: 88,
    required: 75,
    totalDays: 120,
    presentDays: 106,
    absentDays: 14,
    monthly: [
        { month: 'Oct', percentage: 92, present: 22, absent: 2 },
        { month: 'Sep', percentage: 85, present: 20, absent: 4 },
        { month: 'Aug', percentage: 88, present: 21, absent: 3 },
        { month: 'Jul', percentage: 70, present: 16, absent: 6, isLow: true }
    ],
    subjects: [
        { name: 'Mathematics', percentage: 95 },
        { name: 'Science', percentage: 85 },
        { name: 'English', percentage: 80 }
    ],
    history: [
        { date: '2023-10-25', status: 'Present', type: 'Regular' },
        { date: '2023-10-24', status: 'Present', type: 'Regular' },
        { date: '2023-10-23', status: 'Absent', type: 'Sick Leave' },
        { date: '2023-10-22', status: 'Holiday', type: 'Sunday' }
    ]
};

// ====================================
// HOMEWORK DATA (from Homework.jsx)
// ====================================
export const MOCK_HOMEWORK = [
    {
        id: 1,
        subject: 'Mathematics',
        title: 'Algebra: Linear Equations',
        dueDate: '2023-10-25',
        status: 'Pending',
        teacher: 'Mr. Sharma',
        description: 'Complete exercises 4.1 to 4.3 from the textbook.'
    },
    {
        id: 2,
        subject: 'Science',
        title: 'Physics Lab Report',
        dueDate: '2023-10-22',
        status: 'Submitted',
        teacher: 'Mrs. Gupta',
        description: 'Submit the report on laws of motion.'
    },
    {
        id: 3,
        subject: 'English',
        title: 'Essay on Environment',
        dueDate: '2023-10-20',
        status: 'Late',
        teacher: 'Ms. Roy',
        description: 'Write a 500-word essay on environmental conservation.'
    },
    {
        id: 4,
        subject: 'History',
        title: 'Mughal Empire Timeline',
        dueDate: '2023-10-18',
        status: 'Submitted',
        teacher: 'Mr. Khan',
        description: 'Create a timeline of major Mughal emperors.'
    },
];

// ====================================
// HOMEWORK DETAILS (from HomeworkDetail.jsx)
// ====================================
export const MOCK_HOMEWORK_DETAILS = {
    1: {
        id: 1,
        subject: 'Mathematics',
        title: 'Algebra: Linear Equations',
        dueDate: '2023-10-25',
        status: 'Pending',
        teacher: 'Mr. Sharma',
        description: 'Complete exercises 4.1 to 4.3 from the textbook. Ensure you show all working steps. This assignment counts towards 10% of your final grade.',
        attachments: [
            { name: 'Algebra_Worksheet.pdf', size: '2.5 MB' }
        ],
        remarks: null
    },
    2: {
        id: 2,
        subject: 'Science',
        title: 'Physics Lab Report',
        dueDate: '2023-10-22',
        status: 'Submitted',
        teacher: 'Mrs. Gupta',
        description: 'Submit the report on laws of motion.',
        attachments: [],
        remarks: 'Good work, but chart alignment needs improvement.'
    }
};

// ====================================
// EXAMS DATA
// ====================================
export const MOCK_EXAMS = [
    {
        id: 1,
        title: 'Mid-Term Examination',
        type: 'Mid-Term',
        date: 'Oct 2023',
        status: 'Passed',
        overall: '85%',
        grade: 'A',
        isLatest: true
    },
    {
        id: 2,
        title: 'Unit Test 1',
        type: 'Unit Test',
        date: 'Aug 2023',
        status: 'Passed',
        overall: '78%',
        grade: 'B+',
        isLatest: false
    },
    {
        id: 3,
        title: 'Unit Test 2',
        type: 'Unit Test',
        date: 'Sep 2023',
        status: 'Needs Improvement',
        overall: '60%',
        grade: 'C',
        isLatest: false
    }
];

// ====================================
// RESULT DETAILS (from ResultDetail.jsx)
// ====================================
export const MOCK_RESULT_DETAILS = {
    1: {
        id: 1,
        title: 'Mid-Term Examination',
        date: 'October 2023',
        status: 'Passed',
        overall: '85%',
        grade: 'A',
        totalMarks: 500,
        obtainedMarks: 425,
        remarks: 'Excellent performance. Keep it up!',
        subjects: [
            { name: 'Mathematics', marks: 95, total: 100, grade: 'A+', remark: 'Outstanding' },
            { name: 'Science', marks: 88, total: 100, grade: 'A', remark: 'Very Good' },
            { name: 'English', marks: 82, total: 100, grade: 'A', remark: 'Good effort' },
            { name: 'History', marks: 75, total: 100, grade: 'B+', remark: 'Can do better' },
            { name: 'Computer', marks: 85, total: 100, grade: 'A', remark: 'Good' }
        ]
    }
};

// ====================================
// NOTICE DETAILS (from NoticeDetail.jsx)
// ====================================
export const MOCK_NOTICE_DETAILS = {
    1: {
        id: 1,
        title: 'Annual Sports Day 2023',
        category: 'Event',
        date: '18 Oct 2023',
        issuedBy: 'Principal Office',
        content: `Dear Parents,
        
        We are excited to announce our Annual Sports Day scheduled for October 25th, 2023. This year, we have planned a variety of track and field events for students across all grades.
        
        Please ensure your ward arrives in full sports uniform by 8:00 AM. Refreshments will be provided. Parents are cordially invited to cheer for the students.
        
        We look forward to your presence.
        
        Regards,
        School Administration`,
        attachments: [
            { name: 'Event_Schedule.pdf', size: '1.2 MB' }
        ],
        requiresAck: false,
        ackStatus: null
    },
    2: {
        id: 2,
        title: 'Revised Fee Structure',
        category: 'Fee',
        date: '15 Oct 2023',
        issuedBy: 'Accounts Department',
        content: `Dear Parents,
        
        This is to inform you about the revised fee structure applicable from the next academic term. Due to increased operational costs and new facility upgrades, there will be a marginal increase of 5% in tuition fees.
        
        The detailed breakdown is attached. We appreciate your cooperation.
        
        Please acknowledge receipt of this information.`,
        attachments: [
            { name: 'Fee_Structure_2024.pdf', size: '0.8 MB' }
        ],
        requiresAck: true,
        ackStatus: null
    }
};

// ====================================
// TEACHERS DATA (from Teachers.jsx)
// ====================================
export const MOCK_TEACHERS = [
    {
        id: 'T001',
        name: 'Mrs. Priya Sharma',
        subject: 'Mathematics',
        qualification: 'M.Sc., B.Ed',
        experience: '12 years',
        email: 'priya.sharma@school.edu',
        phone: '9876543210',
        isClassTeacher: true,
        forClass: '10-A'
    },
    {
        id: 'T002',
        name: 'Mr. Rajesh Kumar',
        subject: 'Science',
        qualification: 'M.Sc. Physics',
        experience: '8 years',
        email: 'rajesh.kumar@school.edu',
        phone: '9876543211',
        isClassTeacher: false,
        forClass: null
    },
    {
        id: 'T003',
        name: 'Ms. Anjali Verma',
        subject: 'English',
        qualification: 'M.A. English, B.Ed',
        experience: '10 years',
        email: 'anjali.verma@school.edu',
        phone: '9876543212',
        isClassTeacher: false,
        forClass: null
    },
    {
        id: 'T004',
        name: 'Mr. Vikram Singh',
        subject: 'Hindi',
        qualification: 'M.A. Hindi',
        experience: '15 years',
        email: 'vikram.singh@school.edu',
        phone: '9876543213',
        isClassTeacher: true,
        forClass: '6-B'
    }
];

// ====================================
// DOCUMENTS DATA (from Documents.jsx)
// ====================================
export const MOCK_DOCUMENTS = [
    {
        id: 'DOC001',
        name: 'Report Card - Term 1',
        type: 'Academic',
        childId: 'S001',
        date: '2024-10-15',
        status: 'Available',
        size: '1.2 MB'
    },
    {
        id: 'DOC002',
        name: 'Fee Receipt - Q3',
        type: 'Finance',
        childId: 'S001',
        date: '2024-10-01',
        status: 'Available',
        size: '256 KB'
    },
    {
        id: 'DOC003',
        name: 'Transfer Certificate',
        type: 'Certificate',
        childId: 'S001',
        date: null,
        status: 'Not Generated',
        size: null
    },
    {
        id: 'DOC004',
        name: 'Bonafide Certificate',
        type: 'Certificate',
        childId: 'S001',
        date: '2024-09-20',
        status: 'Available',
        size: '180 KB'
    },
    {
        id: 'DOC005',
        name: 'Report Card - Term 1',
        type: 'Academic',
        childId: 'S002',
        date: '2024-10-15',
        status: 'Available',
        size: '1.1 MB'
    },
    {
        id: 'DOC006',
        name: 'Medical Certificate',
        type: 'Medical',
        childId: 'S002',
        date: null,
        status: 'Pending Upload',
        size: null
    }
];


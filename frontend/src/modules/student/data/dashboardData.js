
// Mock Data for Student Dashboard

export const studentProfile = {
    name: 'Hritik',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hritik',
    unreadNotifications: 3,
};

export const alerts = [
    {
        id: 1,
        type: 'critical',
        title: 'Attendance Warning',
        message: 'Your Math attendance is 68%.',
        icon: 'AlertCircle',
        color: 'bg-red-50 text-red-700 border-red-100',
        link: '/student/attendance'
    },
    {
        id: 2,
        type: 'warning',
        title: 'Homework Due',
        message: 'Physics Assignment due today.',
        icon: 'Clock',
        color: 'bg-orange-50 text-orange-700 border-orange-100',
        link: '/student/homework'
    },
    {
        id: 3,
        type: 'info',
        title: 'Fee Reminder',
        message: 'Quarterly fees due in 5 days.',
        icon: 'CreditCard',
        color: 'bg-blue-50 text-blue-700 border-blue-100',
        link: '/student/fees'
    }
];

export const todayClasses = [
    {
        id: 1,
        subject: 'Mathematics',
        teacher: 'Mr. Sharma',
        time: '09:00 AM - 10:00 AM',
        mode: 'offline',
        room: '101'
    },
    {
        id: 2,
        subject: 'Physics',
        teacher: 'Mr. Verma',
        time: '10:30 AM - 11:30 AM',
        mode: 'online',
        link: 'https://meet.google.com/abc'
    },
    {
        id: 3,
        subject: 'English',
        teacher: 'Ms. Das',
        time: '12:00 PM - 01:00 PM',
        mode: 'offline',
        room: '102'
    },
];

export const stats = {
    homework: {
        pending: 3,
        nextDue: 'Maths (Today)',
        link: '/student/homework'
    },
    attendance: {
        percentage: 78,
        status: 'Good',
        color: 'text-emerald-600 bg-emerald-50',
        link: '/student/attendance'
    },
    exams: {
        nextExam: 'Physics Test',
        daysLeft: 4,
        link: '/student/exams'
    },
    materials: {
        newCount: 5,
        link: '/student/notes'
    }
};

export const performance = {
    weeklyAttendanceChange: +5, // percentage
    homeworkCompletion: 92, // percentage
    message: "You're doing great! 🌟 Your attendance improved by 5% this week."
};

export const dashboardData = {
    studentProfile,
    alerts,
    todayClasses,
    stats,
    performance
};

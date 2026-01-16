
export const teacherProfile = {
    name: "Mr. Rajesh Sharma",
    id: "TCH-2024-056",
    role: "Senior Mathematics Teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1&backgroundColor=e5e7eb",
    email: "rajesh.sharma@edu.crm",
    unreadNotifications: 3
};

export const adminNotices = [
    {
        id: 1,
        title: "Submit Exam Marks",
        type: "Urgent", // Urgent, Academic, General
        message: "Final term marks for Class 10-A must be submitted by Friday, 5 PM.",
        date: "2026-01-16",
        priorityColor: "bg-red-50 text-red-700 border-red-100"
    },
    {
        id: 2,
        title: "Staff Meeting",
        type: "General",
        message: "Monthly staff meeting scheduled for Saturday at 10 AM in the main hall.",
        date: "2026-01-15",
        priorityColor: "bg-blue-50 text-blue-700 border-blue-100"
    },
    {
        id: 3,
        title: "Syllabus Update",
        type: "Academic",
        message: "New guidelines for Chapter 5 Geometry have been updated by the HOD.",
        date: "2026-01-14",
        priorityColor: "bg-amber-50 text-amber-700 border-amber-100"
    }
];

export const todayClasses = [
    {
        id: "CLS-101",
        time: "09:00 AM - 10:00 AM",
        classSection: "Class 10-A",
        subject: "Mathematics",
        room: "Room 302",
        status: "Pending", // Pending, Marked
        attendance: null
    },
    {
        id: "CLS-102",
        time: "10:15 AM - 11:15 AM",
        classSection: "Class 9-B",
        subject: "Mathematics",
        room: "Lab 2",
        status: "Marked",
        attendance: "92%"
    },
    {
        id: "CLS-103",
        time: "12:00 PM - 01:00 PM",
        classSection: "Class 11-C",
        subject: "Applied Maths",
        room: "Room 305",
        status: "Pending",
        attendance: null
    }
];

export const pendingActions = [
    {
        id: "ACT-1",
        title: "Attendance Pending",
        count: 2,
        type: "attendance",
        color: "text-orange-600 bg-orange-50"
    },
    {
        id: "ACT-2",
        title: "Homework Reviews",
        count: 15,
        type: "homework",
        color: "text-purple-600 bg-purple-50"
    },
    {
        id: "ACT-3",
        title: "Queries Unanswered",
        count: 4,
        type: "query",
        color: "text-blue-600 bg-blue-50"
    }
];

export const performanceStats = {
    attendanceCompletion: 85, // percentage
    homeworkReviewed: 60,
    engagementScore: 4.2 // out of 5
};

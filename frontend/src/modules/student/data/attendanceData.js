
export const attendanceData = {
    overall: {
        present: 285,
        total: 320,
        percentage: 89,
        status: "Safe", // Safe, Warning, Risk
        lastUpdated: "2026-01-15T14:30:00"
    },
    eligibility: {
        isEligible: true,
        requiredPercentage: 75,
        targetDate: "2026-03-01",
        classesNeeded: 0,
        message: "You are well above the 75% threshold. Keep it up!"
    },
    subjects: [
        {
            id: "sub-001",
            name: "Physics",
            teacher: "Mr. R.K. Verma",
            present: 42,
            total: 60,
            percentage: 70,
            status: "Warning",
            riskLevel: "medium" // low, medium, high
        },
        {
            id: "sub-002",
            name: "Mathematics",
            teacher: "Mrs. S. Gupta",
            present: 55,
            total: 60,
            percentage: 91,
            status: "Safe",
            riskLevel: "low"
        },
        {
            id: "sub-003",
            name: "Chemistry",
            teacher: "Dr. A. Singh",
            present: 38,
            total: 60,
            percentage: 63,
            status: "Risk",
            riskLevel: "high"
        },
        {
            id: "sub-004",
            name: "English Core",
            teacher: "Ms. P. Das",
            present: 58,
            total: 60,
            percentage: 96,
            status: "Safe",
            riskLevel: "low"
        },
        {
            id: "sub-005",
            name: "Computer Science",
            teacher: "Mr. J. Doe",
            present: 50,
            total: 55,
            percentage: 90,
            status: "Safe",
            riskLevel: "low"
        }
    ],
    monthlyLog: [
        // Generating current month data for example
        { date: "2026-01-01", status: "Holiday", type: "Winter Break" },
        { date: "2026-01-02", status: "Holiday", type: "Winter Break" },
        { date: "2026-01-03", status: "Holiday", type: "Winter Break" },
        { date: "2026-01-04", status: "Holiday", type: "Sunday" },
        { date: "2026-01-05", status: "Present" },
        { date: "2026-01-06", status: "Present" },
        { date: "2026-01-07", status: "Absent" },
        { date: "2026-01-08", status: "Present" },
        { date: "2026-01-09", status: "Present" },
        { date: "2026-01-10", status: "Leave", type: "Medical" },
        { date: "2026-01-11", status: "Holiday", type: "Sunday" },
        { date: "2026-01-12", status: "Present" },
        { date: "2026-01-13", status: "Present" },
        { date: "2026-01-14", status: "Present" },
        { date: "2026-01-15", status: "Present" },
    ],
    history: [
        { id: 1, date: "2026-01-15", subject: "Physics", status: "Present", markedBy: "System" },
        { id: 2, date: "2026-01-15", subject: "Mathematics", status: "Present", markedBy: "Mrs. S. Gupta" },
        { id: 3, date: "2026-01-14", subject: "Chemistry", status: "Absent", markedBy: "Dr. A. Singh" },
        { id: 4, date: "2026-01-14", subject: "English", status: "Present", markedBy: "Ms. P. Das" },
        { id: 5, date: "2026-01-14", subject: "Computer Science", status: "Present", markedBy: "Mr. J. Doe" },
    ]
};

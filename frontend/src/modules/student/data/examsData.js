
export const examsData = {
    upcoming: [
        {
            id: 1,
            title: "Mid-Term Examination",
            subjects: ["Mathematics", "Physics"],
            date: "2026-02-05",
            time: "09:00 AM - 12:00 PM",
            type: "Offline",
            location: "Hall A, Main Block",
            syllabus: "Chapters 1-5 (Math), Units 1-3 (Phy)",
            status: "Scheduled",
            admitCardUrl: "#"
        },
        {
            id: 2,
            title: "Unit Test 3",
            subjects: ["English Core"],
            date: "2026-02-12",
            time: "10:00 AM - 11:30 AM",
            type: "Offline",
            location: "Classroom 10-A",
            syllabus: "Poetry Section: Unit 4",
            status: "Scheduled"
        }
    ],
    results: [
        {
            id: 101,
            examName: "Unit Test 2",
            date: "2026-01-10",
            totalMarks: 50,
            obtainedMarks: 42,
            percentage: 84,
            grade: "A",
            status: "Pass",
            publishedDate: "2026-01-15",
            subjects: [
                { name: "Mathematics", marks: 22, total: 25, grade: "A" },
                { name: "Physics", marks: 20, total: 25, grade: "A" }
            ],
            remarks: "Great performance in Physics. Keep improving in Mathematics."
        },
        {
            id: 102,
            examName: "Quarterly Examination",
            date: "2025-10-15",
            totalMarks: 500,
            obtainedMarks: 385,
            percentage: 77,
            grade: "B+",
            status: "Pass",
            publishedDate: "2025-10-25",
            subjects: [
                { name: "Mathematics", marks: 75, total: 100, grade: "B+" },
                { name: "Physics", marks: 68, total: 100, grade: "B" },
                { name: "Chemistry", marks: 82, total: 100, grade: "A" },
                { name: "English", marks: 85, total: 100, grade: "A" },
                { name: "Computer Science", marks: 75, total: 100, grade: "B+" }
            ],
            remarks: "Satisfactory. Focus more on Physics concepts."
        }
    ],
    performance: {
        trend: [
            { exam: 'UT1', percentage: 65 },
            { exam: 'Quarterly', percentage: 77 },
            { exam: 'UT2', percentage: 84 },
        ],
        subjectAverage: [
            { subject: 'Math', avg: 72 },
            { subject: 'Physics', avg: 68 },
            { subject: 'Chem', avg: 75 },
            { subject: 'Eng', avg: 80 },
        ],
        insight: "Your performance has consistently improved over the last 3 exams. Keep it up!"
    }
};

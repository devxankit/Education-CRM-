
export const homeworkData = [
    {
        id: "HW-101",
        subject: "Mathematics",
        title: "Quadratic Equations - Exercise 4.2",
        teacher: "Mr. Sharma",
        assignedDate: "2026-01-14T09:00:00",
        dueDate: "2026-01-16T23:59:00", // Due Today
        status: "Pending", // Pending, Submitted, Late, Checked, Overdue
        instructions: "Complete questions 1 to 15 from Exercise 4.2. Show all steps clearly. Submit as a single PDF.",
        attachments: [
            { name: "Maths_Worksheet_4.2.pdf", size: "1.2 MB", type: "pdf" }
        ],
        submission: null,
        maxMarks: 20
    },
    {
        id: "HW-102",
        subject: "Physics",
        title: "Laws of Motion - Numerical Problems",
        teacher: "Mr. Verma",
        assignedDate: "2026-01-12T10:30:00",
        dueDate: "2026-01-14T17:00:00",
        status: "Overdue",
        instructions: "Solve the attached numerical problems. Pay attention to units.",
        attachments: [
            { name: "Physics_Numericals.pdf", size: "850 KB", type: "pdf" }
        ],
        submission: null,
        maxMarks: 15
    },
    {
        id: "HW-103",
        subject: "English",
        title: "Essay Writing: Climate Change",
        teacher: "Ms. Das",
        assignedDate: "2026-01-10T09:00:00",
        dueDate: "2026-01-13T23:59:00",
        status: "Checked",
        instructions: "Write an essay of 500 words on the impact of climate change. Focus on local examples.",
        attachments: [],
        submission: {
            date: "2026-01-12T14:30:00",
            files: [{ name: "Climate_Change_Essay.docx", size: "24 KB", type: "docx" }],
            note: "Submitted early."
        },
        feedback: {
            marks: 18,
            maxMarks: 20,
            remarks: "Well written. Good use of vocabulary. Work on paragraph transitions.",
            reviewedDate: "2026-01-14T10:00:00"
        }
    },
    {
        id: "HW-104",
        subject: "Computer Science",
        title: "Python Lab Report - Arrays",
        teacher: "Mr. J. Doe",
        assignedDate: "2026-01-08T11:00:00",
        dueDate: "2026-01-11T16:00:00",
        status: "Submitted",
        instructions: "Submit the lab report for Array operations. Include code snippets and output screenshots.",
        attachments: [
            { name: "Lab_Manual_Ch3.pdf", size: "2.5 MB", type: "pdf" }
        ],
        submission: {
            date: "2026-01-11T15:45:00",
            files: [{ name: "Lab_Report_Arrays.pdf", size: "1.8 MB", type: "pdf" }],
            note: ""
        },
        feedback: null
    }
];

export const homeworkStats = {
    pending: 1,
    overdue: 1,
    submitted: 2
};

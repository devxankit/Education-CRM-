
export const supportData = {
    faq: [
        {
            category: "Academics",
            questions: [
                { q: "How do I request a subject change?", a: "Subject changes require approval from the class teacher. Please raise a ticket under 'Academics'." },
                { q: "Where can I find the syllabus?", a: "The syllabus is available in the Academics > Materials section." }
            ]
        },
        {
            category: "Attendance",
            questions: [
                { q: "How to correct attendance?", a: "If marked absent incorrectly, raise an 'Attendance Issue' ticket within 24 hours." },
                { q: "What is the minimum attendance required?", a: "75% attendance is mandatory to appear for final exams." }
            ]
        },
        {
            category: "Fees",
            questions: [
                { q: "Payment not reflecting?", a: "Online payments may take up to 2 hours. If it persists, raise a 'Fees Issue' ticket with the transaction ID." },
                { q: "Can I pay via cash?", a: "Yes, cash payments are accepted at the admin office during working hours." }
            ]
        }
    ],
    tickets: [
        {
            id: "TKT-2026-001",
            category: "Fees / Payment Issue",
            subject: "Payment Failed but deducted",
            status: "In Progress", // Open, In Progress, Resolved, Closed
            date: "2026-01-15T10:30:00",
            lastUpdate: "2026-01-16T09:15:00",
            description: "Transaction failed while paying Q3 fees. Amount deducted from bank. Trans ID: HDF123456.",
            attachments: [],
            updates: [
                { sender: "Admin", message: "We are checking with the payment gateway. Please wait 24 hours.", date: "2026-01-16T09:15:00" }
            ]
        },
        {
            id: "TKT-2026-002",
            category: "Attendance Issue",
            subject: "Marked absent on 12th Jan",
            status: "Resolved",
            date: "2026-01-13T08:45:00",
            lastUpdate: "2026-01-14T11:00:00",
            description: "I was present for the Biology lab but marked absent.",
            attachments: [],
            updates: [
                { sender: "Admin", message: "Verified with teacher. Attendance corrected.", date: "2026-01-14T11:00:00" }
            ]
        },
        {
            id: "TKT-2025-089",
            category: "Academics",
            subject: "Missing Homework Access",
            status: "Closed",
            date: "2025-12-20T14:00:00",
            lastUpdate: "2025-12-21T10:00:00",
            description: "Unable to see Maths homework for this week.",
            attachments: [],
            updates: []
        }
    ],
    categories: [
        "Attendance Issue",
        "Homework Submission Issue",
        "Exam / Result Issue",
        "Fees / Payment Issue",
        "Profile Correction",
        "Library / Other"
    ]
};

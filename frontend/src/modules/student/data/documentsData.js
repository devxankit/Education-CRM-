
export const documentsData = [
    {
        id: "DOC-001",
        name: "Student ID Card",
        category: "Identity",
        date: "2025-06-01",
        type: "PDF",
        size: "150 KB",
        status: "Available",
        isVerified: true,
        downloadUrl: "#",
        permissions: { view: true, download: true }
    },
    {
        id: "DOC-002",
        name: "Bonafide Certificate",
        category: "Certificates",
        date: "2025-08-15",
        type: "PDF",
        size: "240 KB",
        status: "Available",
        isVerified: true,
        downloadUrl: "#",
        permissions: { view: true, download: true }
    },
    {
        id: "DOC-003",
        name: "Quarterly Marksheet (2025)",
        category: "Academic",
        date: "2025-10-30",
        type: "Image",
        size: "1.2 MB",
        status: "Available",
        isVerified: true,
        downloadUrl: "#",
        permissions: { view: true, download: true }
    },
    {
        id: "DOC-004",
        name: "Transfer Certificate",
        category: "Certificates",
        date: "2026-06-01",
        type: "PDF",
        size: "Unknown",
        status: "Pending", // Pending, Available, Expired
        isVerified: false,
        downloadUrl: null,
        permissions: { view: false, download: false }
    },
    {
        id: "DOC-005",
        name: "Fee Receipt - Q3",
        category: "Financial",
        date: "2025-12-10",
        type: "PDF",
        size: "80 KB",
        status: "Available",
        isVerified: true,
        downloadUrl: "#",
        permissions: { view: true, download: true }
    },
    {
        id: "DOC-006",
        name: "Library Card",
        category: "Identity",
        date: "2025-06-01",
        type: "PDF",
        size: "120 KB",
        status: "Expired",
        isVerified: true,
        downloadUrl: "#",
        permissions: { view: true, download: false }
    }
];

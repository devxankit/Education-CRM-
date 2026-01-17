
export const teacherProfileData = {
    personal: {
        id: 'EMP-2024-056',
        name: 'Suresh Kumar',
        email: 'suresh.kumar@edu-crm.com',
        phone: '+91 98765 43210',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
        status: 'Active',
        role: 'Senior Teacher',
        designation: 'PGT - Mathematics',
        department: 'Science & Mathematics',
        joiningDate: '2019-06-15',
        qualification: 'M.Sc. Mathematics, B.Ed',
        institute: 'City Public School'
    },
    academic: {
        year: '2025-2026',
        subjects: [
            { id: 'SUB-01', name: 'Mathematics', classes: ['10-A', '10-B', '12-Science'] },
            { id: 'SUB-02', name: 'Physics', classes: ['9-B'] }
        ]
    },
    security: {
        lastLogin: '2026-01-16 09:30 AM',
        twoFactorEnabled: true,
        passwordLastChanged: '2025-11-20'
    },
    preferences: {
        notifications: {
            attendanceReminders: true,
            homeworkSubmissions: true,
            adminNotices: true,
            emailAlerts: false
        },
        theme: 'light',
        language: 'English'
    }
};

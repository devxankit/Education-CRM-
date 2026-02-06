
import { STAFF_ROLES } from './roles';

// Mapping roles to their specific dashboard widgets and configurations
export const ROLE_DASHBOARD_MAP = {
    [STAFF_ROLES.FRONT_DESK]: {
        primaryWidgets: ['TotalAdmissions', 'PendingAdmissions', 'TodayAdmissions', 'PendingDocuments'],
        secondaryWidgets: ['TotalStudents', 'AdminNotices'],
        quickActions: ['AddNewInquiry', 'UploadDocuments', 'ViewPendingAdmissions'],
        bannerText: "Manage admissions, inquiries & front desk operations"
    },
    [STAFF_ROLES.ACCOUNTS]: {
        primaryWidgets: ['PendingFees', 'TodayCollections', 'PendingPayroll', 'UnpaidExpenses'],
        secondaryWidgets: ['FeeNotices', 'PolicyReminders'],
        quickActions: ['ViewFeeLedger', 'AddExpense', 'ProcessPayroll', 'ManageVendors'],
        bannerText: "Track fees, payroll, expenses & financial records"
    },
    [STAFF_ROLES.TRANSPORT]: {
        primaryWidgets: ['ActiveRoutes', 'BusAllocationIssues', 'DriverStatus'],
        secondaryWidgets: ['TransportNotices', 'MaintenanceAlerts'],
        quickActions: ['AssignStudentRoute', 'ViewRouteDetails', 'ReportTransportIssue'],
        bannerText: "Oversee routes, buses & student transport safety"
    },
    [STAFF_ROLES.DATA_ENTRY]: {
        primaryWidgets: ['IncompleteProfiles', 'PendingVerifications', 'MissingEmployeeRecords'],
        secondaryWidgets: ['AdminInstructions', 'StaffNotices'],
        quickActions: ['AddStudent', 'AddEmployee', 'AddTeacher', 'VerifyDocuments'],
        bannerText: "Central Data Management & Compliance"
    },
    [STAFF_ROLES.SUPPORT]: {
        primaryWidgets: ['OpenTickets', 'HighPriorityTickets', 'SlaBreachAlerts'],
        secondaryWidgets: ['AdminAnnouncements', 'SupportGuidelines'],
        quickActions: ['ViewOpenTickets', 'RespondToTicket', 'CloseTicket'],
        bannerText: "Resolve student & parent queries efficiently"
    },
    [STAFF_ROLES.PRINCIPAL]: {
        primaryWidgets: ['TotalAdmissions', 'PendingAdmissions', 'TodayAdmissions', 'TeacherStatus'],
        secondaryWidgets: ['AdminNotices', 'AcademicCalendar'],
        quickActions: ['UpdateClassInfo', 'ViewPendingAdmissions', 'AddNewInquiry'],
        bannerText: "Academic & Administrative Leadership"
    },
    [STAFF_ROLES.TEACHER]: {
        primaryWidgets: ['MyClasses', 'TodayAttendance', 'PendingAssignments'],
        secondaryWidgets: ['StaffNotices', 'AcademicCalendar'],
        quickActions: ['MarkAttendance', 'UploadNotes', 'ScheduleClass'],
        bannerText: "Manage your classes and student progress"
    },
    [STAFF_ROLES.ADMIN]: {
        primaryWidgets: ['SystemHealth', 'AllStaffOverview'],
        secondaryWidgets: [],
        quickActions: [],
        bannerText: "Administrator Overview"
    }
};
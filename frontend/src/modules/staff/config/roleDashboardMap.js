
import { STAFF_ROLES } from './roles';

// Mapping roles to their specific dashboard widgets and configurations
export const ROLE_DASHBOARD_MAP = {
    [STAFF_ROLES.FRONT_DESK]: {
        primaryWidgets: ['TodayAdmissions', 'VisitorRequests', 'PendingDocuments'],
        secondaryWidgets: ['TotalStudents', 'AdminNotices'],
        quickActions: ['AddNewInquiry', 'UploadDocuments', 'ViewPendingAdmissions'],
        bannerText: "Manage admissions, inquiries & front desk operations"
    },
    [STAFF_ROLES.ACCOUNTS]: {
        primaryWidgets: ['PendingFees', 'TodayCollections', 'OverdueFees'],
        secondaryWidgets: ['FeeNotices', 'PolicyReminders'],
        quickActions: ['ViewFeeLedger', 'DownloadFeeReport', 'ViewReceipts'],
        bannerText: "Track fees, collections & financial records"
    },
    [STAFF_ROLES.TRANSPORT]: {
        primaryWidgets: ['ActiveRoutes', 'BusAllocationIssues', 'DriverStatus'],
        secondaryWidgets: ['TransportNotices', 'MaintenanceAlerts'],
        quickActions: ['AssignStudentRoute', 'ViewRouteDetails', 'ReportTransportIssue'],
        bannerText: "Oversee routes, buses & student transport safety"
    },
    [STAFF_ROLES.DATA_ENTRY]: {
        primaryWidgets: ['PendingDataUpdates', 'ClassSectionUpdates', 'VerificationTasks'],
        secondaryWidgets: ['AdminInstructions', 'CalendarAlerts'],
        quickActions: ['EditStudentRecords', 'VerifyDocuments', 'UpdateClassInfo'],
        bannerText: "Maintain accurate student & academic records"
    },
    [STAFF_ROLES.SUPPORT]: {
        primaryWidgets: ['OpenTickets', 'HighPriorityTickets', 'SlaBreachAlerts'],
        secondaryWidgets: ['AdminAnnouncements', 'SupportGuidelines'],
        quickActions: ['ViewOpenTickets', 'RespondToTicket', 'CloseTicket'],
        bannerText: "Resolve student & parent queries efficiently"
    },
    [STAFF_ROLES.ADMIN]: {
        primaryWidgets: ['SystemHealth', 'AllStaffOverview'],
        secondaryWidgets: [],
        quickActions: [],
        bannerText: "Administrator Overview"
    }
};
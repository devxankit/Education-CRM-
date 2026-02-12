
import {
    LayoutDashboard,
    Building2,
    Users,
    GraduationCap,
    UsersRound,
    Wallet,
    Settings as SettingsIcon,
    FileText,
    MessageSquare,
    BarChart3,
    Cog,
    Shield,
    ChevronDown,
    ChevronRight
} from 'lucide-react';

/**
 * Admin Panel Menu Configuration
 * Based on admin.txt - 12 Main Modules
 */

export const adminMenuConfig = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/admin/dashboard',
        subItems: []
    },
    {
        id: 'institution',
        label: 'Institution Setup',
        icon: Building2,
        path: '/admin/institution',
        subItems: [
            { id: 'profile', label: 'Institution Profile', path: '/admin/institution/profile' },
            { id: 'branches', label: 'Branches / Campuses', path: '/admin/institution/branches' },
            { id: 'academic-years', label: 'Academic Years', path: '/admin/institution/academic-years' },
            { id: 'calendars', label: 'Holidays & Calendars', path: '/admin/institution/calendars' },
            { id: 'timetable-rules', label: 'Timetable Rules', path: '/admin/institution/timetable-rules' }
        ]
    },
    {
        id: 'users',
        label: 'User & Role Management',
        icon: Users,
        path: '/admin/users',
        subItems: [
            { id: 'admins', label: 'Admin Users', path: '/admin/users/admins' },
            { id: 'roles', label: 'Staff Roles', path: '/admin/roles' },
            { id: 'access-control', label: 'Access Control Rules', path: '/admin/access-control' }
        ]
    },
    {
        id: 'academics',
        label: 'Academic Management',
        icon: GraduationCap,
        path: '/admin/academics',
        subItems: [
            { id: 'classes', label: 'Classes', path: '/admin/academics/classes' },
            { id: 'sections', label: 'Sections', path: '/admin/academics/sections' },
            { id: 'subjects', label: 'Subjects', path: '/admin/academics/subjects' },
            { id: 'programs', label: 'Programs / Courses', path: '/admin/academics/programs' },
            { id: 'timetable', label: 'Weekly Timetable', path: '/admin/academics/timetable' },
            { id: 'teacher-mapping', label: 'Teacher–Subject Mapping', path: '/admin/academics/teacher-mapping' },
            { id: 'exam-policies', label: 'Exam Policies', path: '/admin/academics/exam-policies' },
            { id: 'exams', label: 'Exams & Scheduling', path: '/admin/academics/exams' }
        ]
    },
    {
        id: 'people',
        label: 'People Management',
        icon: UsersRound,
        path: '/admin/people',
        subItems: [
            { id: 'students', label: 'Students (Master View)', path: '/admin/people/students' },
            { id: 'teachers', label: 'Teachers', path: '/admin/people/teachers' },

            { id: 'parents', label: 'Parents', path: '/admin/people/parents' },
            { id: 'departments', label: 'Departments & Roles', path: '/admin/people/departments' },
            { id: 'employment-types', label: 'Employment Types & Rules', path: '/admin/people/employment-types' },
            { id: 'bulk-import', label: 'Bulk Import', path: '/admin/people/bulk-import' }
        ]
    },
    {
        id: 'finance',
        label: 'Finance Management',
        icon: Wallet,
        path: '/admin/finance',
        subItems: [
            { id: 'fee-structures', label: 'Fee Structures', path: '/admin/finance/fee-structures' },
            { id: 'fee-policies', label: 'Fee Policies', path: '/admin/finance/fee-policies' },
            { id: 'payroll-rules', label: 'Payroll Rules', path: '/admin/finance/payroll-rules' },
            { id: 'payroll', label: 'Payroll Management', path: '/admin/finance/payroll' },
            { id: 'expense-categories', label: 'Expense Categories', path: '/admin/finance/expense-categories' },
            { id: 'taxes', label: 'Tax & Deductions', path: '/admin/finance/taxes' }
        ]
    },
    {
        id: 'operations',
        label: 'Operations Management',
        icon: SettingsIcon,
        path: '/admin/operations',
        subItems: [
            { id: 'admissions-rules', label: 'Admission Policy', path: '/admin/operations/admissions-rules' },
            { id: 'transport', label: 'Transport Setup', path: '/admin/operations/transport-config' },
            { id: 'routes', label: 'Routes & Stops', path: '/admin/operations/routes' },
            { id: 'asset-rules', label: 'Asset Governance', path: '/admin/operations/asset-rules' },
            { id: 'support-rules', label: 'Helpdesk Rules', path: '/admin/operations/support-rules' },
            { id: 'inventory', label: 'Inventory Categories', path: '/admin/operations/inventory' },
            { id: 'assets-master', label: 'Assets Master', path: '/admin/operations/inventory/assets' },
            { id: 'hostels', label: 'Hostel Management', path: '/admin/operations/hostels' },
            { id: 'hostel', label: 'Hostel Setup (Optional)', path: '/admin/operations/hostel-config' },
            { id: 'document-rules', label: 'Document Rules', path: '/admin/operations/document-rules' }
        ]
    },
    {
        id: 'compliance',
        label: 'Documents & Compliance',
        icon: FileText,
        path: '/admin/compliance',
        subItems: [
            { id: 'document-rules', label: 'Required Documents Rules', path: '/admin/compliance/required-documents' },
            { id: 'verification-policies', label: 'Verification Policies', path: '/admin/compliance/verification-policies' },
            { id: 'certificate-templates', label: 'Certificate Templates', path: '/admin/compliance/certificate-templates' },
            { id: 'checklists', label: 'Compliance Checklist', path: '/admin/compliance/checklists' }
        ]
    },
    {
        id: 'communication',
        label: 'Communication',
        icon: MessageSquare,
        path: '/admin/communication',
        subItems: [
            { id: 'notices', label: 'Notices & Circulars', path: '/admin/communication/notices' },
            { id: 'announcements', label: 'Announcements', path: '/admin/communication/announcements' },
            { id: 'templates', label: 'Email / SMS Templates', path: '/admin/communication/templates' },
            { id: 'notification-rules', label: 'Notification Rules', path: '/admin/communication/notification-rules' }
        ]
    },
    {
        id: 'reports',
        label: 'Reports & Analytics',
        icon: BarChart3,
        path: '/admin/reports',
        subItems: [
            { id: 'academic', label: 'Academic Reports', path: '/admin/reports/academic' },
            { id: 'finance', label: 'Finance Reports', path: '/admin/reports/finance' },
            { id: 'hr', label: 'HR Reports', path: '/admin/reports/hr' },
            { id: 'operations', label: 'Operations Reports', path: '/admin/reports/operations' },
            { id: 'custom', label: 'Custom Reports', path: '/admin/reports/custom' }
        ]
    },
    {
        id: 'settings',
        label: 'System Settings',
        icon: Cog,
        path: '/admin/settings',
        subItems: [
            { id: 'general', label: 'General Settings', path: '/admin/settings/general' },
            { id: 'integrations', label: 'Integrations', path: '/admin/settings/integrations' },
            { id: 'backup', label: 'Backup & Recovery', path: '/admin/settings/backup' }
        ]
    },
    {
        id: 'audit',
        label: 'Security & Audit Logs',
        icon: Shield,
        path: '/admin/audit',
        subItems: [
            { id: 'user-activity', label: 'User Activity Logs', path: '/admin/audit/user-activity' },
            { id: 'financial', label: 'Financial Logs', path: '/admin/audit/financial' },
            { id: 'data-history', label: 'Data Change History', path: '/admin/audit/data-history' },
            { id: 'security', label: 'Login & Security Logs', path: '/admin/audit/security' }
        ]
    }
];

export default adminMenuConfig;

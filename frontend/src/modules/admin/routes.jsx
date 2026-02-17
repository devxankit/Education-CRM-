
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AdminAuthGuard from './components/auth/AdminAuthGuard';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';


// Institution Pages
import InstitutionProfile from './pages/institution/Profile';
import Branches from './pages/institution/Branches';
import AcademicYears from './pages/institution/AcademicYears';
import Calendars from './pages/institution/Calendars';
import TimetableRules from './pages/institution/TimetableRules';


// User & Role Pages
import RolesList from './pages/roles/RolesList';

import StaffUsers from './pages/users/StaffUsers';
import AccessControl from './pages/users/AccessControl';

// Finance Management Pages
import FeeStructures from './pages/finance/FeeStructures';
import FeePolicies from './pages/finance/FeePolicies';
import PayrollRules from './pages/finance/PayrollRules';
import Payroll from './pages/finance/Payroll';
import ExpenseCategories from './pages/finance/ExpenseCategories';
import Taxes from './pages/finance/Taxes';

// Academic Management Pages
import Classes from './pages/academics/Classes';
import Sections from './pages/academics/Sections';
import ClassSectionsDetail from './pages/academics/ClassSectionsDetail';
import SubjectsMaster from './pages/academics/SubjectsMaster';
import WeeklyTimetable from './pages/academics/WeeklyTimetable';
import ProgramsMaster from './pages/academics/ProgramsMaster';
import TeacherMapping from './pages/academics/TeacherMapping';
import ClassTeacherAssignment from './pages/academics/ClassTeacherAssignment';
import ExamPolicies from './pages/academics/ExamPolicies';
import Exams from './pages/academics/Exams';

// Operations Management Pages
import AdmissionRules from './pages/operations/AdmissionsRules';
import TransportConfig from './pages/operations/TransportConfig';
import HostelConfig from './pages/operations/HostelConfig';
import AddHostel from './pages/operations/hostels/AddHostel';
import HostelList from './pages/operations/hostels/HostelList';
import HostelDetails from './pages/operations/hostels/HostelDetails';
import DocumentRules from './pages/operations/DocumentRules';
import CommunicationRules from './pages/operations/CommunicationRules';
import AssetRules from './pages/operations/AssetRules';
import SupportRules from './pages/operations/SupportRules';
import TransportRoutes from './pages/operations/TransportRoutes';
import InventoryCategories from './pages/operations/InventoryCategories';
import AssetsMaster from './pages/operations/AssetsMaster';

import Teachers from './pages/people/teachers/Teachers';
import Parents from './pages/people/parents/Parents';
import Departments from './pages/people/departments/Departments';
import StudentList from './pages/people/students/StudentList';
import StudentAdmission from './pages/people/students/admission/StudentAdmission';
import StudentProfile from './pages/people/students/profile/StudentProfile';
import EmploymentTypes from './pages/people/employment-types/EmploymentTypes';
import BulkImport from './pages/people/bulk-import/BulkImport';
import Notices from './pages/communication/notices/Notices';
import Announcements from './pages/communication/announcements/Announcements';
import MessageTemplates from './pages/communication/templates/MessageTemplates';
import NotificationRules from './pages/communication/notification-rules/NotificationRules';
import AcademicReports from './pages/reports/academic/AcademicReports';
import CertificateTemplates from './pages/compliance/certificate-templates/CertificateTemplates';
import HRReports from './pages/reports/hr/HRReports';
import FinanceReports from './pages/reports/finance/FinanceReports';
import OperationsReports from './pages/reports/operations/OperationsReports';
import CustomReports from './pages/reports/custom/CustomReports';
import GeneralSettings from './pages/settings/general/GeneralSettings';
import AppConfiguration from './pages/settings/app-configuration/AppConfiguration';
import Integrations from './pages/settings/integrations/Integrations';
import FAQ from './pages/settings/faq/FAQ';
import BackupsRecovery from './pages/settings/backups/BackupsRecovery';
import RequiredDocumentsRules from './pages/compliance/required-documents/RequiredDocumentsRules';
import DocumentRulesCompliance from './pages/compliance/document-rules/DocumentRulesCompliance';
import UserActivityAudit from './pages/audit/user-activity/UserActivityAudit';
import FinancialAudit from './pages/audit/financial/FinancialAudit';
import DataHistory from './pages/audit/data-history/DataHistory';
import SecurityAudit from './pages/audit/security/SecurityAudit';
import VerificationPolicies from './pages/compliance/verification-policies/VerificationPolicies';
import Checklists from './pages/compliance/checklists/Checklists';

// Helper to render Outlet
const OutletWrapper = () => <Outlet />;

const adminRoutes = [
    {
        path: 'admin',
        element: <OutletWrapper />,
        children: [
            { path: 'login', element: <Login /> },
            // Protected Routes – token nahi to /admin/login pe bhejo
            {
                element: <AdminAuthGuard />,
                children: [
                    {
                        element: <AdminLayout />,
                        children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <Dashboard /> },

                    // 2. Institution Setup
                    { path: 'institution/profile', element: <InstitutionProfile /> },
                    { path: 'institution/branches', element: <Branches /> },
                    { path: 'institution/academic-years', element: <AcademicYears /> },
                    { path: 'institution/calendars', element: <Calendars /> },
                    { path: 'institution/timetable-rules', element: <TimetableRules /> },

                    // 3. User & Role Management (Restructured)
                    { path: 'users/admins', element: <StaffUsers /> },

                    { path: 'roles', element: <RolesList /> },

                    { path: 'access-control', element: <AccessControl /> },





                    // ... (Rest of code)

                    // 4. Academic Management (Changed 'academic' to 'academics')
                    { path: 'academics/classes', element: <Classes /> },
                    { path: 'academics/sections', element: <Sections /> },
                    { path: 'academics/sections/:classId', element: <ClassSectionsDetail /> },

                    { path: 'academics/subjects', element: <SubjectsMaster /> },
                    { path: 'academics/programs', element: <ProgramsMaster /> },
                    { path: 'academics/timetable', element: <WeeklyTimetable /> },

                    { path: 'academics/teacher-mapping', element: <TeacherMapping /> },
                    { path: 'academics/class-teacher', element: <ClassTeacherAssignment /> },
                    { path: 'academics/exam-policies', element: <ExamPolicies /> },
                    { path: 'academics/exams', element: <Exams /> },

                    // 5. People Management
                    { path: 'people/students/add', element: <StudentAdmission /> },
                    { path: 'people/students/:id', element: <StudentProfile /> }, // New Route
                    { path: 'people/students', element: <StudentList /> },
                    { path: 'people/teachers', element: <Teachers /> },

                    { path: 'people/employment-types', element: <EmploymentTypes /> }, // New Route
                    { path: 'people/parents', element: <Parents /> },
                    { path: 'people/departments', element: <Departments /> }, // New Route
                    { path: 'people/bulk-import', element: <BulkImport /> },

                    // 6. Finance Management
                    { path: 'finance/fee-structures', element: <FeeStructures /> },
                    { path: 'finance/fee-policies', element: <FeePolicies /> },
                    { path: 'finance/payroll-rules', element: <PayrollRules /> },
                    { path: 'finance/payroll', element: <Payroll /> },
                    { path: 'finance/expense-categories', element: <ExpenseCategories /> },
                    { path: 'finance/taxes', element: <Taxes /> },

                    // 7. Operations Management
                    { path: 'operations/admissions-rules', element: <AdmissionRules /> },
                    { path: 'operations/transport-config', element: <TransportConfig /> }, // Renamed from 'transport' to 'transport-config' to match request or keep 'transport'? Request said '/admin/operations/transport-config'
                    { path: 'operations/routes', element: <TransportRoutes /> },
                    { path: 'operations/asset-rules', element: <AssetRules /> },
                    { path: 'operations/support-rules', element: <SupportRules /> },
                    { path: 'operations/inventory', element: <InventoryCategories /> },
                    { path: 'operations/inventory/assets', element: <AssetsMaster /> }, // New Route
                    { path: 'operations/hostel-config', element: <HostelConfig /> },
                    { path: 'operations/hostels', element: <HostelList /> },
                    { path: 'operations/hostels/add', element: <AddHostel /> },
                    { path: 'operations/hostels/edit/:id', element: <AddHostel /> },
                    { path: 'operations/hostels/view/:id', element: <HostelDetails /> },
                    { path: 'operations/document-rules', element: <DocumentRules /> },
                    { path: 'operations/communication-rules', element: <CommunicationRules /> }, // Communication Governance

                    // 8. Documents & Compliance (Renamed from 'documents')
                    { path: 'compliance/required-documents', element: <RequiredDocumentsRules /> },
                    { path: 'compliance/document-rules', element: <DocumentRulesCompliance /> },
                    { path: 'compliance/verification-policies', element: <VerificationPolicies /> },
                    { path: 'compliance/certificate-templates', element: <CertificateTemplates /> },
                    { path: 'compliance/checklists', element: <Checklists /> },

                    // 9. Communication
                    { path: 'communication/notices', element: <Notices /> },
                    { path: 'communication/announcements', element: <Announcements /> },
                    { path: 'communication/templates', element: <MessageTemplates /> },
                    { path: 'communication/notification-rules', element: <NotificationRules /> },

                    // 10. Reports & Analytics
                    { path: 'reports/academic', element: <AcademicReports /> },
                    { path: 'reports/finance', element: <FinanceReports /> },
                    { path: 'reports/hr', element: <HRReports /> },
                    { path: 'reports/operations', element: <OperationsReports /> },
                    { path: 'reports/custom', element: <CustomReports /> },

                    // 11. System Settings (Renamed from 'system')
                    { path: 'settings/general', element: <GeneralSettings /> },
                    { path: 'settings/faq', element: <FAQ /> },
                    { path: 'settings/app-config', element: <AppConfiguration /> },
                    { path: 'settings/integrations', element: <Integrations /> },
                    { path: 'settings/backup', element: <BackupsRecovery /> },

                    // 12. Security & Audit Logs (Renamed from 'security')
                    { path: 'audit/user-activity', element: <UserActivityAudit /> },
                    { path: 'audit/financial', element: <FinancialAudit /> },
                    { path: 'audit/data-history', element: <DataHistory /> },
                    { path: 'audit/security', element: <SecurityAudit /> },

                    { path: '*', element: <Navigate to="/admin/dashboard" replace /> }
                        ]
                    }
                ]
            }
        ]
    }
];

export default adminRoutes;

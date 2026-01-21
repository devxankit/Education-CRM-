
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/PlaceholderPage';


// Institution Pages
import InstitutionProfile from './pages/institution/Profile';
import Branches from './pages/institution/Branches';
import AcademicYears from './pages/institution/AcademicYears';
import Calendars from './pages/institution/Calendars';
import TimetableRules from './pages/institution/TimetableRules';


// User & Role Pages
import RolesList from './pages/roles/RolesList';
import RolePermissions from './pages/roles/RolePermissions';
import StaffUsers from './pages/users/StaffUsers';
import AccessControl from './pages/users/AccessControl';

// Finance Management Pages
import FeeStructures from './pages/finance/FeeStructures';
import FeePolicies from './pages/finance/FeePolicies';
import PayrollRules from './pages/finance/PayrollRules';
import ExpenseCategories from './pages/finance/ExpenseCategories';

// Academic Management Pages
import ClassesSections from './pages/academics/ClassesSections';
import SubjectsMaster from './pages/academics/SubjectsMaster';
import ProgramsMaster from './pages/academics/ProgramsMaster';
import TeacherMapping from './pages/academics/TeacherMapping';
import ExamPolicies from './pages/academics/ExamPolicies';

// Operations Management Pages
import AdmissionRules from './pages/operations/AdmissionsRules';
import TransportConfig from './pages/operations/TransportConfig';
import HostelConfig from './pages/operations/HostelConfig';
import DocumentRules from './pages/operations/DocumentRules';
import CommunicationRules from './pages/operations/CommunicationRules';
import AssetRules from './pages/operations/AssetRules';
import SupportRules from './pages/operations/SupportRules';
import TransportRoutes from './pages/operations/TransportRoutes';
import InventoryCategories from './pages/operations/InventoryCategories';
import AssetsMaster from './pages/operations/AssetsMaster';
import Employees from './pages/people/employees/Employees';
import Teachers from './pages/people/teachers/Teachers';
import Parents from './pages/people/parents/Parents';
import Departments from './pages/people/departments/Departments'; // New Import
import StudentList from './pages/people/students/StudentList';
import StudentAdmission from './pages/people/students/admission/StudentAdmission';
import StudentProfile from './pages/people/students/profile/StudentProfile';
import EmploymentTypes from './pages/people/employment-types/EmploymentTypes'; // New Import

// Helper to render Outlet
const OutletWrapper = () => <Outlet />;

const adminRoutes = [
    {
        path: 'admin',
        element: <OutletWrapper />,
        children: [
            // Protected Routes
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
                    // Both routes point to permission matrix for now to handle flow
                    { path: 'permissions', element: <RolePermissions /> },
                    { path: 'roles/:roleId', element: <RolePermissions /> },
                    { path: 'access-control', element: <AccessControl /> },





                    // ... (Rest of code)

                    // 4. Academic Management (Changed 'academic' to 'academics')
                    // Both routes point to the same Master-Detail Controller
                    { path: 'academics/classes', element: <ClassesSections /> },
                    { path: 'academics/sections', element: <ClassesSections /> },

                    { path: 'academics/subjects', element: <SubjectsMaster /> },
                    { path: 'academics/programs', element: <ProgramsMaster /> },

                    { path: 'academics/teacher-mapping', element: <TeacherMapping /> },
                    { path: 'academics/exam-policies', element: <ExamPolicies /> },

                    // 5. People Management
                    { path: 'people/students/add', element: <StudentAdmission /> },
                    { path: 'people/students/:id', element: <StudentProfile /> }, // New Route
                    { path: 'people/students', element: <StudentList /> },
                    { path: 'people/teachers', element: <Teachers /> },
                    { path: 'people/employees', element: <Employees /> },
                    { path: 'people/employment-types', element: <EmploymentTypes /> }, // New Route
                    { path: 'people/parents', element: <Parents /> },
                    { path: 'people/departments', element: <Departments /> }, // New Route
                    { path: 'people/bulk-import', element: <PlaceholderPage /> },

                    // 6. Finance Management
                    { path: 'finance/fee-structures', element: <FeeStructures /> },
                    { path: 'finance/fee-policies', element: <FeePolicies /> },
                    { path: 'finance/payroll-rules', element: <PayrollRules /> },
                    { path: 'finance/expense-categories', element: <ExpenseCategories /> },
                    { path: 'finance/taxes', element: <PlaceholderPage /> },

                    // 7. Operations Management
                    { path: 'operations/admissions-rules', element: <AdmissionRules /> },
                    { path: 'operations/transport-config', element: <TransportConfig /> }, // Renamed from 'transport' to 'transport-config' to match request or keep 'transport'? Request said '/admin/operations/transport-config'
                    { path: 'operations/routes', element: <TransportRoutes /> },
                    { path: 'operations/asset-rules', element: <AssetRules /> },
                    { path: 'operations/support-rules', element: <SupportRules /> },
                    { path: 'operations/inventory', element: <InventoryCategories /> },
                    { path: 'operations/inventory/assets', element: <AssetsMaster /> }, // New Route
                    { path: 'operations/hostel-config', element: <HostelConfig /> },
                    { path: 'operations/document-rules', element: <DocumentRules /> },
                    { path: 'operations/communication-rules', element: <CommunicationRules /> }, // Communication Governance

                    // 8. Documents & Compliance (Renamed from 'documents')
                    { path: 'compliance/document-rules', element: <PlaceholderPage /> },
                    { path: 'compliance/verification-policies', element: <PlaceholderPage /> },
                    { path: 'compliance/certificate-templates', element: <PlaceholderPage /> },
                    { path: 'compliance/checklists', element: <PlaceholderPage /> },

                    // 9. Communication
                    { path: 'communication/notices', element: <PlaceholderPage /> },
                    { path: 'communication/announcements', element: <PlaceholderPage /> },
                    { path: 'communication/templates', element: <PlaceholderPage /> },
                    { path: 'communication/notification-rules', element: <PlaceholderPage /> },

                    // 10. Reports & Analytics
                    { path: 'reports/academic', element: <PlaceholderPage /> },
                    { path: 'reports/finance', element: <PlaceholderPage /> },
                    { path: 'reports/hr', element: <PlaceholderPage /> },
                    { path: 'reports/operations', element: <PlaceholderPage /> },
                    { path: 'reports/custom', element: <PlaceholderPage /> },

                    // 11. System Settings (Renamed from 'system')
                    { path: 'settings/general', element: <PlaceholderPage /> },
                    { path: 'settings/app-config', element: <PlaceholderPage /> },
                    { path: 'settings/integrations', element: <PlaceholderPage /> },
                    { path: 'settings/backup', element: <PlaceholderPage /> },

                    // 12. Security & Audit Logs (Renamed from 'security')
                    { path: 'audit/user-activity', element: <PlaceholderPage /> },
                    { path: 'audit/financial', element: <PlaceholderPage /> },
                    { path: 'audit/data-history', element: <PlaceholderPage /> },
                    { path: 'audit/security', element: <PlaceholderPage /> },

                    { path: '*', element: <Navigate to="/admin/dashboard" replace /> }
                ]
            }
        ]
    }
];

export default adminRoutes;

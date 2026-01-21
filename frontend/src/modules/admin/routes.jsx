
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
                    { path: 'people/students', element: <PlaceholderPage /> },
                    { path: 'people/teachers', element: <PlaceholderPage /> },
                    { path: 'people/employees', element: <PlaceholderPage /> },
                    { path: 'people/parents', element: <PlaceholderPage /> },
                    { path: 'people/bulk-import', element: <PlaceholderPage /> },

                    // 6. Finance Management
                    { path: 'finance/fee-structures', element: <FeeStructures /> },
                    { path: 'finance/fee-policies', element: <FeePolicies /> },
                    { path: 'finance/payroll-rules', element: <PayrollRules /> },
                    { path: 'finance/expense-categories', element: <ExpenseCategories /> },
                    { path: 'finance/taxes', element: <PlaceholderPage /> },

                    // 7. Operations Management
                    { path: 'operations/transport', element: <PlaceholderPage /> },
                    { path: 'operations/routes', element: <PlaceholderPage /> },
                    { path: 'operations/assets', element: <PlaceholderPage /> },
                    { path: 'operations/inventory', element: <PlaceholderPage /> },
                    { path: 'operations/hostel', element: <PlaceholderPage /> },

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

                    { path: '*', element: <Navigate to="dashboard" replace /> }
                ]
            }
        ]
    }
];

export default adminRoutes;

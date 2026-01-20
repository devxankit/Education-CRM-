
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import StaffLayout from './layouts/StaffLayout';
import { StaffAuthProvider } from './context/StaffAuthContext';
import StaffRoleGuard from './components/auth/StaffRoleGuard';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import NewAdmission from './pages/NewAdmission';
import Teachers from './pages/Teachers';
import TeacherDetail from './pages/TeacherDetail';
import AddTeacher from './pages/AddTeacher';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import AddEmployee from './pages/AddEmployee';
import Payroll from './pages/Payroll';
import PayrollDetail from './pages/PayrollDetail';
import PayslipView from './pages/PayslipView';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import Vendors from './pages/Vendors';
import DocumentDetail from './pages/DocumentDetail';
import DocumentPreview from './pages/DocumentPreview';
import Fees from './pages/Fees';
import Documents from './pages/Documents';
import Transport from './pages/Transport';
import Notices from './pages/Notices';
import NoticeDetail from './pages/NoticeDetail';
import Support from './pages/Support';
import NewTicket from './pages/NewTicket';
import TicketDetail from './pages/TicketDetail';
import Reports from './pages/Reports';
import TransportRoutes from './pages/TransportRoutes';
import RouteDetail from './pages/RouteDetail';
import StudentTransport from './pages/StudentTransport';
import TransportIssues from './pages/TransportIssues';
import Assets from './pages/Assets';
import AddAsset from './pages/AddAsset';
import AssetDetail from './pages/AssetDetail';
import Inventory from './pages/Inventory';
import AddInventoryItem from './pages/AddInventoryItem';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Helper to render Outlet for the provider wrapper
const OutletWrapper = () => <Outlet />;

const staffRoutes = [
    {
        path: 'staff',
        element: <StaffAuthProvider><OutletWrapper /></StaffAuthProvider>, // Wrap entire section in Auth Provider
        children: [
            // Public Route
            { path: 'login', element: <Login /> },

            // Protected Routes
            {
                element: <StaffRoleGuard />,
                children: [
                    {
                        element: <StaffLayout />,
                        children: [
                            { index: true, element: <Navigate to="dashboard" replace /> },
                            { path: 'dashboard', element: <Dashboard /> },
                            { path: 'students', element: <Students /> },
                            { path: 'students/new', element: <NewAdmission /> },
                            { path: 'students/:studentId', element: <StudentDetail /> },
                            { path: 'teachers', element: <Teachers /> },
                            { path: 'teachers/new', element: <AddTeacher /> },
                            { path: 'teachers/:teacherId', element: <TeacherDetail /> },
                            { path: 'fees', element: <Fees /> },
                            { path: 'documents', element: <Documents /> },
                            { path: 'transport', element: <Transport /> },
                            { path: 'notices', element: <Notices /> },
                            { path: 'notices/:noticeId', element: <NoticeDetail /> },

                            { path: 'support', element: <Support /> },
                            { path: 'support/new', element: <NewTicket /> },
                            { path: 'support/:ticketId', element: <TicketDetail /> },

                            { path: 'reports', element: <Reports /> },
                            { path: 'profile', element: <Profile /> },
                            { path: 'settings', element: <Settings /> },

                            { path: 'employees', element: <Employees /> },
                            { path: 'employees/new', element: <AddEmployee /> },
                            { path: 'employees/:employeeId', element: <EmployeeDetail /> },
                            { path: 'payroll', element: <Payroll /> },
                            { path: 'payroll/:rollId', element: <PayrollDetail /> },
                            { path: 'expenses', element: <Expenses /> },
                            { path: 'expenses/new', element: <AddExpense /> },
                            { path: 'vendors', element: <Vendors /> },
                            { path: 'documents/:type/:entityId', element: <DocumentDetail /> },
                            { path: 'documents/:type/:entityId/preview', element: <DocumentPreview /> },
                            { path: 'transport/routes', element: <TransportRoutes /> },
                            { path: 'transport/routes/:routeId', element: <RouteDetail /> },
                            { path: 'transport/students', element: <StudentTransport /> },
                            { path: 'transport/issues', element: <TransportIssues /> },
                            { path: 'assets', element: <Assets /> },
                            { path: 'assets/new', element: <AddAsset /> },
                            { path: 'assets/:assetId', element: <AssetDetail /> },
                            { path: 'inventory', element: <Inventory /> },
                            { path: 'inventory/new', element: <AddInventoryItem /> },

                            { path: '*', element: <Navigate to="dashboard" replace /> },
                        ]
                    }
                ]
            }
        ]
    }
];

export default staffRoutes;
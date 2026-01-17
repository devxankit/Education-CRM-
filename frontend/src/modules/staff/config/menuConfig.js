
import { STAFF_ROLES } from './roles';
import { Home, Users, CreditCard, FileText, Truck, Bell, BarChart2, Headphones, Settings } from 'lucide-react';

export const MENU_CONFIG = [
    {
        label: 'Dashboard',
        path: '/staff/dashboard',
        icon: Home,
        roles: [STAFF_ROLES.FRONT_DESK, STAFF_ROLES.ACCOUNTS, STAFF_ROLES.TRANSPORT, STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.SUPPORT]
    },
    {
        label: 'Students',
        path: '/staff/students',
        icon: Users,
        roles: [STAFF_ROLES.FRONT_DESK, STAFF_ROLES.ACCOUNTS, STAFF_ROLES.TRANSPORT, STAFF_ROLES.DATA_ENTRY]
    },
    {
        label: 'Fees & Accounts',
        path: '/staff/fees',
        icon: CreditCard,
        roles: [STAFF_ROLES.ACCOUNTS]
    },
    {
        label: 'Documents',
        path: '/staff/documents',
        icon: FileText,
        roles: [STAFF_ROLES.FRONT_DESK, STAFF_ROLES.ACCOUNTS, STAFF_ROLES.DATA_ENTRY]
    },
    {
        label: 'Transport',
        path: '/staff/transport',
        icon: Truck,
        roles: [STAFF_ROLES.TRANSPORT, STAFF_ROLES.FRONT_DESK]
    },
    {
        label: 'Notices',
        path: '/staff/notices',
        icon: Bell,
        roles: [STAFF_ROLES.FRONT_DESK, STAFF_ROLES.DATA_ENTRY]
    },
    {
        label: 'Reports',
        path: '/staff/reports',
        icon: BarChart2,
        roles: [STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN]
    },
    {
        label: 'Support',
        path: '/staff/support',
        icon: Headphones,
        roles: [STAFF_ROLES.SUPPORT, STAFF_ROLES.FRONT_DESK]
    },
    {
        label: 'Settings',
        path: '/staff/settings',
        icon: Settings,
        roles: [STAFF_ROLES.ADMIN, STAFF_ROLES.FRONT_DESK] // Everyone might have profile, but general settings maybe restricted
    }
];
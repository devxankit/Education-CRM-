
import { STAFF_ROLES } from './roles';

export const PERMISSIONS = {
    // Dashboard
    DASHBOARD_VIEW: 'dashboard.view',

    // Students
    STUDENT_VIEW_LIST: 'student.view.list',
    STUDENT_VIEW_DETAIL: 'student.view.detail',
    STUDENT_EDIT: 'student.edit',
    STUDENT_ADD: 'student.add',

    // Fees
    FEES_VIEW: 'fees.view',
    FEES_COLLECT: 'fees.collect', // Edit/Add receipt
    FEES_EDIT_STRUCTURE: 'fees.edit_structure',

    // Documents
    DOCUMENTS_VIEW: 'documents.view',
    DOCUMENTS_UPLOAD: 'documents.upload',
    DOCUMENTS_VERIFY: 'documents.verify',

    // Transport
    TRANSPORT_VIEW: 'transport.view',
    TRANSPORT_MANAGE: 'transport.manage',

    // Reports
    REPORTS_VIEW: 'reports.view',
};

export const ROLE_PERMISSIONS = {
    [STAFF_ROLES.FRONT_DESK]: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.STUDENT_VIEW_LIST,
        PERMISSIONS.STUDENT_VIEW_DETAIL,
        PERMISSIONS.DOCUMENTS_VIEW,
        PERMISSIONS.DOCUMENTS_UPLOAD,
        PERMISSIONS.NOTICES_VIEW
    ],
    [STAFF_ROLES.ACCOUNTS]: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.STUDENT_VIEW_LIST,
        PERMISSIONS.STUDENT_VIEW_DETAIL,
        PERMISSIONS.FEES_VIEW,
        PERMISSIONS.FEES_COLLECT,
        PERMISSIONS.REPORTS_VIEW
    ],
    [STAFF_ROLES.TRANSPORT]: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.STUDENT_VIEW_LIST,
        PERMISSIONS.TRANSPORT_VIEW,
        PERMISSIONS.TRANSPORT_MANAGE
    ],
    [STAFF_ROLES.DATA_ENTRY]: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.STUDENT_VIEW_LIST,
        PERMISSIONS.STUDENT_VIEW_DETAIL,
        PERMISSIONS.STUDENT_EDIT,
        PERMISSIONS.STUDENT_ADD
    ]
};
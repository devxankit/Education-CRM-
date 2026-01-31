// support.api.js - Staff Module Support/Ticket API Service
// This service will be used for backend integration

// Mock data for initial setup (will be replaced with actual API calls)
const MOCK_TICKETS = [
    { id: 'TKT-1001', title: 'Fee Payment Issue', status: 'Open', priority: 'High', student: 'Aarav Patel', createdAt: '2024-10-10' },
    { id: 'TKT-1002', title: 'Transport Schedule Change', status: 'Open', priority: 'Medium', student: 'Ishita Sharma', createdAt: '2024-10-09' },
    { id: 'TKT-1003', title: 'Document Verification', status: 'Closed', priority: 'Low', student: 'Rohan Mehta', createdAt: '2024-10-08' },
];

const MOCK_NOTICES = [
    { id: 'N-2024-001', title: 'Emergency: School Closed Tomorrow', category: 'Emergency', priority: 'Urgent', status: 'Pending', date: '2024-10-10' },
    { id: 'N-2024-002', title: 'Annual Day Celebration', category: 'Event', priority: 'Normal', status: 'Read', date: '2024-10-08' },
];

/**
 * Fetch all tickets
 * @returns {Promise<Array>} List of tickets
 */
export const fetchTickets = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_TICKETS), 300);
    });
};

/**
 * Fetch ticket by ID
 * @param {string} ticketId - Ticket ID
 * @returns {Promise<Object|null>} Ticket object or null
 */
export const fetchTicketById = async (ticketId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const ticket = MOCK_TICKETS.find(t => t.id === ticketId);
            resolve(ticket || null);
        }, 300);
    });
};

/**
 * Fetch all notices
 * @returns {Promise<Array>} List of notices
 */
export const fetchNotices = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_NOTICES), 300);
    });
};

/**
 * Fetch notice by ID
 * @param {string} noticeId - Notice ID
 * @returns {Promise<Object|null>} Notice object or null
 */
export const fetchNoticeById = async (noticeId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const notice = MOCK_NOTICES.find(n => n.id === noticeId);
            resolve(notice || null);
        }, 300);
    });
};

/**
 * Send message to ticket
 * @param {string} ticketId - Ticket ID
 * @param {Object} message - Message data
 * @returns {Promise<Object>} Updated ticket
 */
export const sendTicketMessage = async (ticketId, message) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, ticketId, message });
        }, 300);
    });
};

/**
 * Close ticket
 * @param {string} ticketId - Ticket ID
 * @param {string} resolution - Resolution note
 * @returns {Promise<Object>} Updated ticket
 */
export const closeTicket = async (ticketId, resolution) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, ticketId, status: 'Closed', resolution });
        }, 300);
    });
};

export default {
    fetchTickets,
    fetchTicketById,
    fetchNotices,
    fetchNoticeById,
    sendTicketMessage,
    closeTicket,
};
// support.api.js - Parent Module Support/Tickets API Service
// This service will be used for backend integration

/**
 * Get all support tickets
 * @returns {Promise<Array>} List of tickets
 */
export const getTickets = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 'TKT001', subject: 'Fee Query', status: 'Open', createdAt: '2024-10-10', priority: 'Medium' },
                { id: 'TKT002', subject: 'Transport Issue', status: 'Closed', createdAt: '2024-10-05', priority: 'High' },
            ]);
        }, 300);
    });
};

/**
 * Get ticket by ID
 * @param {string} ticketId - Ticket ID
 * @returns {Promise<Object|null>} Ticket details
 */
export const getTicketById = async (ticketId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: ticketId,
                subject: 'Fee Query',
                status: 'Open',
                createdAt: '2024-10-10',
                priority: 'Medium',
                messages: [
                    { id: 1, sender: 'Parent', message: 'I have a query about the fee structure.', time: '10:00 AM' },
                    { id: 2, sender: 'Support', message: 'Please share your child\'s ID for verification.', time: '10:30 AM' },
                ]
            });
        }, 300);
    });
};

/**
 * Create new ticket
 * @param {Object} ticketData - Ticket data
 * @returns {Promise<Object>} Created ticket
 */
export const createTicket = async (ticketData) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                ticket: {
                    id: `TKT-${Date.now()}`,
                    ...ticketData,
                    status: 'Open',
                    createdAt: new Date().toISOString()
                }
            });
        }, 300);
    });
};

/**
 * Send message to ticket
 * @param {string} ticketId - Ticket ID
 * @param {string} message - Message content
 * @returns {Promise<Object>} Message response
 */
export const sendMessage = async (ticketId, message) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: {
                    id: Date.now(),
                    sender: 'Parent',
                    message,
                    time: new Date().toLocaleTimeString()
                }
            });
        }, 300);
    });
};

export default {
    getTickets,
    getTicketById,
    createTicket,
    sendMessage,
};

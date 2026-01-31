// documents.api.js - Staff Module Documents API Service
// This service will be used for backend integration

// Mock data for initial setup (will be replaced with actual API calls)
const MOCK_DOCUMENTS = [
    { id: 'DOC-001', name: 'Aadhaar Card', studentId: 'STU-2024-001', type: 'Identity', status: 'Verified', uploadedAt: '2024-04-15' },
    { id: 'DOC-002', name: 'Transfer Certificate', studentId: 'STU-2024-001', type: 'Academic', status: 'Pending', uploadedAt: '2024-04-16' },
    { id: 'DOC-003', name: 'Birth Certificate', studentId: 'STU-2024-002', type: 'Identity', status: 'Verified', uploadedAt: '2024-05-10' },
];

/**
 * Fetch all documents
 * @returns {Promise<Array>} List of documents
 */
export const fetchDocuments = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DOCUMENTS), 300);
    });
};

/**
 * Fetch documents by student ID
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} List of student's documents
 */
export const fetchDocumentsByStudentId = async (studentId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const docs = MOCK_DOCUMENTS.filter(d => d.studentId === studentId);
            resolve(docs);
        }, 300);
    });
};

/**
 * Upload document
 * @param {string} studentId - Student ID
 * @param {Object} documentData - Document data
 * @returns {Promise<Object>} Uploaded document info
 */
export const uploadDocument = async (studentId, documentData) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                id: `DOC-${Date.now()}`,
                studentId,
                status: 'Pending',
                ...documentData,
            });
        }, 500);
    });
};

/**
 * Verify document
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} Updated document
 */
export const verifyDocument = async (documentId) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                id: documentId,
                status: 'Verified',
                verifiedAt: new Date().toISOString(),
            });
        }, 300);
    });
};

/**
 * Get document statistics
 * @returns {Promise<Object>} Document stats
 */
export const getDocumentStats = async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                total: 3,
                verified: 2,
                pending: 1,
                missing: 0,
            });
        }, 300);
    });
};

export default {
    fetchDocuments,
    fetchDocumentsByStudentId,
    uploadDocument,
    verifyDocument,
    getDocumentStats,
};
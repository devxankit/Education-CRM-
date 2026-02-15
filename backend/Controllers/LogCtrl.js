import UserActivityLog from "../Models/UserActivityLogModel.js";
import FinancialLog from "../Models/FinancialLogModel.js";
import DataChangeLog from "../Models/DataChangeLogModel.js";
import SecurityLog from "../Models/SecurityLogModel.js";

const defaultLimit = 50;
const maxLimit = 200;

/**
 * GET User Activity Logs
 * Query: page, limit, action, userId, entityType, startDate, endDate, branchId
 */
export const getActivityLogs = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { page = 1, limit = defaultLimit, action, userId, entityType, startDate, endDate, branchId } = req.query;
        const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(maxLimit, parseInt(limit, 10) || defaultLimit);
        const take = Math.min(maxLimit, parseInt(limit, 10) || defaultLimit);

        const query = { instituteId };
        if (action) query.action = action;
        if (userId) query.userId = userId;
        if (entityType) query.entityType = entityType;
        if (branchId) query.branchId = branchId;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const [logs, total] = await Promise.all([
            UserActivityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(take).lean(),
            UserActivityLog.countDocuments(query)
        ]);

        return res.status(200).json({ success: true, data: logs, total, page: parseInt(page, 10), limit: take });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET Financial Logs
 * Query: page, limit, type, branchId, startDate, endDate
 */
export const getFinancialLogs = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { page = 1, limit = defaultLimit, type, branchId, startDate, endDate } = req.query;
        const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(maxLimit, parseInt(limit, 10) || defaultLimit);
        const take = Math.min(maxLimit, parseInt(limit, 10) || defaultLimit);

        const query = { instituteId };
        if (type) query.type = type;
        if (branchId) query.branchId = branchId;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const [logs, total] = await Promise.all([
            FinancialLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(take).lean(),
            FinancialLog.countDocuments(query)
        ]);

        return res.status(200).json({ success: true, data: logs, total, page: parseInt(page, 10), limit: take });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET Data Change Logs
 * Query: page, limit, entityType, entityId, action, startDate, endDate
 */
export const getDataChangeLogs = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { page = 1, limit = defaultLimit, entityType, entityId, action, startDate, endDate } = req.query;
        const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(maxLimit, parseInt(limit, 10) || defaultLimit);
        const take = Math.min(maxLimit, parseInt(limit, 10) || defaultLimit);

        const query = { instituteId };
        if (entityType) query.entityType = entityType;
        if (entityId) query.entityId = entityId;
        if (action) query.action = action;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const [logs, total] = await Promise.all([
            DataChangeLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(take).lean(),
            DataChangeLog.countDocuments(query)
        ]);

        return res.status(200).json({ success: true, data: logs, total, page: parseInt(page, 10), limit: take });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * GET Security Logs
 * Query: page, limit, action, identifier, success, startDate, endDate
 */
export const getSecurityLogs = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { page = 1, limit = defaultLimit, action, identifier, success, startDate, endDate } = req.query;
        const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(maxLimit, parseInt(limit, 10) || defaultLimit);
        const take = Math.min(maxLimit, parseInt(limit, 10) || defaultLimit);

        const query = { instituteId };
        if (action) query.action = action;
        if (identifier) query.identifier = new RegExp(identifier, "i");
        if (success !== undefined && success !== "") query.success = success === "true" || success === true;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const [logs, total] = await Promise.all([
            SecurityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(take).lean(),
            SecurityLog.countDocuments(query)
        ]);

        return res.status(200).json({ success: true, data: logs, total, page: parseInt(page, 10), limit: take });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

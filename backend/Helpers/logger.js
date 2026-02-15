/**
 * Central logging helpers for:
 * 1. User Activity Logs - kisne kya action kiya
 * 2. Financial Logs - paise se related entries
 * 3. Data Change History - data me kya change hua
 * 4. Login & Security Logs - login success/fail, security events
 * Sab log fire-and-forget (await nahi zaruri), taaki main flow block na ho.
 */

import UserActivityLog from "../Models/UserActivityLogModel.js";
import FinancialLog from "../Models/FinancialLogModel.js";
import DataChangeLog from "../Models/DataChangeLogModel.js";
import SecurityLog from "../Models/SecurityLogModel.js";

const getIp = (req) =>
    req?.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req?.ip ||
    req?.connection?.remoteAddress ||
    "";

const getUserAgent = (req) => req?.headers?.["user-agent"] || "";

/**
 * 1. User Activity Log - user ne kya action kiya
 * @param {object} req - Express req (optional; for user + ip)
 * @param {object} opts - { instituteId, branchId, userId, userModel, userEmail, userName, action, entityType, entityId, description, metadata }
 */
export async function logUserActivity(req, opts = {}) {
    try {
        const ip = req ? getIp(req) : "";
        const userAgent = req ? getUserAgent(req) : "";
        const payload = {
            instituteId: opts.instituteId ?? req?.user?.instituteId ?? req?.user?._id,
            branchId: opts.branchId ?? req?.user?.branchId,
            userId: opts.userId ?? req?.user?._id,
            userModel: opts.userModel || (req?.role === "staff" ? "Staff" : req?.role === "institute" ? "Institute" : "Staff"),
            userEmail: opts.userEmail ?? req?.user?.email,
            userName: opts.userName ?? req?.user?.name,
            action: opts.action,
            entityType: opts.entityType,
            entityId: opts.entityId,
            description: opts.description,
            ipAddress: opts.ipAddress ?? ip,
            userAgent: opts.userAgent ?? userAgent,
            metadata: opts.metadata
        };
        if (!payload.instituteId || !payload.action) return;
        await UserActivityLog.create(payload);
    } catch (err) {
        console.error("[logUserActivity]", err.message);
    }
}

/**
 * 2. Financial Log - paise ki entry (fee, expense, salary, refund)
 * @param {object} req - Express req (optional)
 * @param {object} opts - { instituteId, branchId, type, amount, referenceType, referenceId, description, performedBy, performedByModel, metadata }
 */
export async function logFinancial(req, opts = {}) {
    try {
        const payload = {
            instituteId: opts.instituteId ?? req?.user?.instituteId ?? req?.user?._id,
            branchId: opts.branchId ?? req?.user?.branchId,
            type: opts.type,
            amount: opts.amount,
            currency: opts.currency || "INR",
            referenceType: opts.referenceType,
            referenceId: opts.referenceId,
            description: opts.description,
            performedBy: opts.performedBy ?? req?.user?._id,
            performedByModel: opts.performedByModel || (req?.role === "staff" ? "Staff" : "Institute"),
            metadata: opts.metadata
        };
        if (!payload.instituteId || payload.amount == null || !payload.type) return;
        await FinancialLog.create(payload);
    } catch (err) {
        console.error("[logFinancial]", err.message);
    }
}

/**
 * 3. Data Change History - kis field me kya change hua
 * @param {object} req - Express req (optional)
 * @param {object} opts - { instituteId, branchId, entityType, entityId, action, changedBy, changedByModel, changedFields, oldValue, newValue, description }
 */
export async function logDataChange(req, opts = {}) {
    try {
        const payload = {
            instituteId: opts.instituteId ?? req?.user?.instituteId ?? req?.user?._id,
            branchId: opts.branchId ?? req?.user?.branchId,
            entityType: opts.entityType,
            entityId: opts.entityId,
            action: opts.action,
            changedBy: opts.changedBy ?? req?.user?._id,
            changedByModel: opts.changedByModel || (req?.role === "staff" ? "Staff" : "Institute"),
            changedByEmail: opts.changedByEmail ?? req?.user?.email,
            changedFields: opts.changedFields || [],
            oldValue: opts.oldValue,
            newValue: opts.newValue,
            description: opts.description
        };
        if (!payload.instituteId || !payload.entityType || !payload.entityId || !payload.action) return;
        await DataChangeLog.create(payload);
    } catch (err) {
        console.error("[logDataChange]", err.message);
    }
}

/**
 * 4. Login & Security Log - login success/fail, lock, 2FA, etc.
 * @param {object} req - Express req (optional)
 * @param {object} opts - { instituteId, userId, userModel, identifier, action, success, message, ipAddress, userAgent, metadata }
 */
export async function logSecurity(req, opts = {}) {
    try {
        const ip = req ? getIp(req) : "";
        const userAgent = req ? getUserAgent(req) : "";
        const payload = {
            instituteId: opts.instituteId ?? req?.user?.instituteId ?? req?.user?._id,
            userId: opts.userId ?? req?.user?._id,
            userModel: opts.userModel || "Staff",
            identifier: opts.identifier ?? req?.body?.email ?? req?.user?.email,
            action: opts.action,
            success: opts.success ?? false,
            message: opts.message,
            ipAddress: opts.ipAddress ?? ip,
            userAgent: opts.userAgent ?? userAgent,
            metadata: opts.metadata
        };
        if (!payload.action) return;
        await SecurityLog.create(payload);
    } catch (err) {
        console.error("[logSecurity]", err.message);
    }
}

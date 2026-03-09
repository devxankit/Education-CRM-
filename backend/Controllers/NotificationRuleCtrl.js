import NotificationRule from "../Models/NotificationRuleModel.js";

export const getNotificationRules = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { status, search } = req.query;

        const query = { instituteId };
        if (status && status !== "ALL") query.status = status;
        if (search && search.trim()) {
            query.$or = [
                { name: { $regex: search.trim(), $options: "i" } },
                { module: { $regex: search.trim(), $options: "i" } },
                { trigger: { $regex: search.trim(), $options: "i" } },
            ];
        }

        const rules = await NotificationRule.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: rules,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createNotificationRule = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const {
            name,
            module,
            trigger,
            condition,
            conditionVal,
            audience,
            channels,
            status,
        } = req.body;

        if (!name || !module || !trigger) {
            return res.status(400).json({
                success: false,
                message: "name, module and trigger are required",
            });
        }

        const rule = await NotificationRule.create({
            instituteId,
            name: name.trim(),
            module: module.trim().toUpperCase(),
            trigger: trigger.trim(),
            condition: (condition || (Number(conditionVal) > 0 ? `Wait ${Number(conditionVal)} Days` : "Instant")).trim(),
            conditionVal: Number(conditionVal) || 0,
            audience: Array.isArray(audience) ? audience : [],
            channels: Array.isArray(channels) ? channels : [],
            status: status || "ACTIVE",
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Notification rule created successfully",
            data: rule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateNotificationRule = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { id } = req.params;
        const updateData = { ...req.body };

        if (updateData.module) updateData.module = String(updateData.module).trim().toUpperCase();
        if (typeof updateData.conditionVal !== "undefined") {
            updateData.conditionVal = Number(updateData.conditionVal) || 0;
        }
        if (!updateData.condition && typeof updateData.conditionVal !== "undefined") {
            updateData.condition = updateData.conditionVal > 0 ? `Wait ${updateData.conditionVal} Days` : "Instant";
        }

        const rule = await NotificationRule.findOneAndUpdate(
            { _id: id, instituteId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!rule) {
            return res.status(404).json({ success: false, message: "Notification rule not found" });
        }

        res.status(200).json({
            success: true,
            message: "Notification rule updated successfully",
            data: rule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteNotificationRule = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { id } = req.params;

        const rule = await NotificationRule.findOneAndDelete({ _id: id, instituteId });

        if (!rule) {
            return res.status(404).json({ success: false, message: "Notification rule not found" });
        }

        res.status(200).json({
            success: true,
            message: "Notification rule deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

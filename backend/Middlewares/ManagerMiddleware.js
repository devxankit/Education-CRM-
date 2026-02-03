import Manager from "../Models/ManagerModel.js";
import jwt from "jsonwebtoken";

export const ManagerMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ success: false, message: "No token, please login", data: null });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Manager.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found", data: null });
    }

    req.user = user;
    next(); // ✅ important
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalid, please login again",
      data: null,
    });
  }
};

export const isManager = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized", data: null });
    }

    if (req.user.role !== "manager") {
      return res.status(403).json({ success: false, message: "You are not a manager", data: null });
    }

    next(); // ✅ important
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

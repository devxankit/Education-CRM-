import Institute from '../Models/InstituteModel.js'
import Student from '../Models/StudentModel.js'
import Teacher from '../Models/TeacherModel.js'
import Parent from '../Models/ParentModel.js'
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import Staff from '../Models/StaffModel.js'

export const AuthMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ success: false, message: "No token, please login" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;
    const role = decoded?.role || 'institute';
    const normalizedRole = role.toLowerCase();

    if (normalizedRole === 'institute') {
      user = await Institute.findById(decoded?.id);
    } else if (normalizedRole === 'staff') {
      user = await Staff.findById(decoded?.id);
    } else if (normalizedRole === 'student') {
      user = await Student.findById(decoded?.id);
    } else if (normalizedRole === 'teacher') {
      user = await Teacher.findById(decoded?.id);
    } else if (normalizedRole === 'parent') {
      user = await Parent.findById(decoded?.id);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    req.role = normalizedRole; // Store as lowercase for consistent checking
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalid, please login again" });
  }
});

export const isInstitute = asyncHandler(async (req, res, next) => {
  if (!req.user || req.role !== 'institute') {
    return res.status(403).json({ success: false, message: "Not authorized as institute" });
  }
  next();
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || (req.role !== 'institute' && req.role !== 'staff')) {
    return res.status(403).json({ success: false, message: "Not authorized as admin" });
  }
  next();
});

export const isStudent = asyncHandler(async (req, res, next) => {
  if (!req.user || req.role !== 'student') {
    return res.status(403).json({ success: false, message: "Not authorized as student" });
  }
  next();
});

export const isTeacher = asyncHandler(async (req, res, next) => {
  if (!req.user || req.role !== 'teacher') {
    return res.status(403).json({ success: false, message: "Not authorized as teacher" });
  }
  next();
});

export const isParent = asyncHandler(async (req, res, next) => {
  if (!req.user || req.role !== 'parent') {
    return res.status(403).json({ success: false, message: "Not authorized as parent" });
  }
  next();
});
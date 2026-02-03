import Institute from '../Models/InstituteModel.js'
import Student from '../Models/StudentModel.js'
import Teacher from '../Models/TeacherModel.js'
import Parent from '../Models/ParentModel.js'
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

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

    if (role === 'institute') {
      user = await Institute.findById(decoded?.id);
    } else if (role === 'Student') {
      user = await Student.findById(decoded?.id);
    } else if (role === 'Teacher') {
      user = await Teacher.findById(decoded?.id);
    } else if (role === 'Parent') {
      user = await Parent.findById(decoded?.id);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    req.role = role; // Attach role for further authorization
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

export const isStudent = asyncHandler(async (req, res, next) => {
  if (!req.user || req.role !== 'Student') {
    return res.status(403).json({ success: false, message: "Not authorized as student" });
  }
  next();
});
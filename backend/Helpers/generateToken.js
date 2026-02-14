import jwt from "jsonwebtoken";

export const generateToken = (id, role, expiresIn = "7d") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });
};

export const generateTempOtpToken = (staffId) => {
  return jwt.sign(
    { id: staffId, purpose: "otp_verification" },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );
};

export const verifyTempOtpToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== "otp_verification") return null;
    return decoded.id;
  } catch {
    return null;
  }
};

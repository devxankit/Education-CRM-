import nodemailer from "nodemailer";

/** When true, emails are logged but not sent (no real SMTP). Set TEST_MODE=true or TEST_MODE=1 in .env */
const isTestMode = () =>
  process.env.TEST_MODE === "true" || process.env.TEST_MODE === "1";

const sendOrSkip = async (transporter, mailOptions, successLog) => {
  if (isTestMode()) {
    console.log("[TEST MODE] Email skipped:", {
      to: mailOptions.to,
      subject: mailOptions.subject,
    });
    if (successLog) console.log(successLog);
    return;
  }
  await transporter.sendMail(mailOptions);
  if (successLog) console.log(successLog);
};

export const sendManagerPasswordEmail = async (to, password, fullName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Din Task" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your Manager Account Credentials",
      html: `
        <h3>Hello ${fullName},</h3>
        <p>Your manager account has been created successfully.</p>
        <p><b>Email:</b> ${to}</p>
        <p><b>Password:</b> ${password}</p>
        <p>Please login and change your password after first login.</p>
      `,
    };

    await sendOrSkip(transporter, mailOptions, "Manager password email sent successfully");
  } catch (error) {
    console.log("Email Error:", error);
  }
};
export const sendEmployeePasswordEmail = async (to, password, fullName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Din Task" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your Manager Account Credentials",
      html: `
        <h3>Hello ${fullName},</h3>
        <p>Your manager account has been created successfully.</p>
        <p><b>Email:</b> ${to}</p>
        <p><b>Password:</b> ${password}</p>
        <p>Please login and change your password after first login.</p>
      `,
    };

    await sendOrSkip(transporter, mailOptions, "Manager password email sent successfully");
  } catch (error) {
    console.log("Email Error:", error);
  }
};
export const sendLoginCredentialsEmail = async (to, password, fullName, role) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Education CRM" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your ${role} Account Credentials`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Welcome to Education CRM</h2>
          <p>Hello <b>${fullName}</b>,</p>
          <p>Your <b>${role}</b> account has been created successfully. Below are your login credentials:</p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><b>Email / User ID:</b> ${to}</p>
            <p style="margin: 5px 0;"><b>Temporary Password:</b> <span style="color: #e11d48; font-family: monospace; font-size: 18px;">${password}</span></p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Please login and change your password immediately for security reasons.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    await sendOrSkip(transporter, mailOptions, `${role} credentials email sent to ${to}`);
  } catch (error) {
    console.log("Email Error:", error);
  }
};

// Send OTP for Staff 2FA login
export const sendStaffOtpEmail = async (to, otp, staffName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Education CRM" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your Login OTP - Education CRM`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Staff Portal - Verification Code</h2>
          <p>Hello <b>${staffName}</b>,</p>
          <p>Use the following OTP to complete your login:</p>
          <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code expires in 5 minutes. Do not share it with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    await sendOrSkip(transporter, mailOptions, `OTP email sent to ${to}`);
    return true;
  } catch (error) {
    console.log("OTP Email Error:", error);
    return false;
  }
};

// Send OTP for Staff Forgot Password
export const sendStaffResetOtpEmail = async (to, otp, staffName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Education CRM" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Password Reset OTP - Staff Portal`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Staff Portal - Password Reset</h2>
          <p>Hello <b>${staffName}</b>,</p>
          <p>Use the following OTP to reset your password:</p>
          <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    await sendOrSkip(transporter, mailOptions, `Staff reset OTP email sent to ${to}`);
    return true;
  } catch (error) {
    console.log("Staff reset OTP Email Error:", error);
    return false;
  }
};

// Send OTP for Teacher Forgot Password
export const sendTeacherResetOtpEmail = async (to, otp, teacherName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Education CRM" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Password Reset OTP - Teacher Portal`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Teacher Portal - Password Reset</h2>
          <p>Hello <b>${teacherName}</b>,</p>
          <p>Use the following OTP to reset your password:</p>
          <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    await sendOrSkip(transporter, mailOptions, `Teacher reset OTP email sent to ${to}`);
    return true;
  } catch (error) {
    console.log("Teacher reset OTP Email Error:", error);
    return false;
  }
};

// Send OTP for Student Forgot Password
export const sendStudentResetOtpEmail = async (to, otp, studentName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Education CRM" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Password Reset OTP - Student Portal`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Student Portal - Password Reset</h2>
          <p>Hello <b>${studentName}</b>,</p>
          <p>Use the following OTP to reset your password:</p>
          <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    await sendOrSkip(transporter, mailOptions, `Student reset OTP email sent to ${to}`);
    return true;
  } catch (error) {
    console.log("Student reset OTP Email Error:", error);
    return false;
  }
};

// Send Parent Credentials when student is registered
export const sendParentCredentialsEmail = async (to, password, parentName, studentName, admissionNo) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Education CRM" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Parent Portal Credentials - ${studentName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Parent Portal</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 16px; color: #374151;">Dear <b>${parentName}</b>,</p>
            <p style="font-size: 16px; color: #374151;">Your child <b>${studentName}</b> has been successfully registered at our institution. You can now access the Parent Portal to track their academic progress, attendance, homework, and more.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <h3 style="color: #4f46e5; margin-top: 0;">Student Details</h3>
              <p style="margin: 5px 0; color: #374151;"><b>Student Name:</b> ${studentName}</p>
              <p style="margin: 5px 0; color: #374151;"><b>Admission No:</b> ${admissionNo}</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">🔐 Your Login Credentials</h3>
              <p style="margin: 8px 0; color: #374151;"><b>Mobile Number:</b> (Your registered mobile)</p>
              <p style="margin: 8px 0; color: #374151;"><b>Password:</b> <span style="background: #4f46e5; color: white; padding: 5px 15px; border-radius: 5px; font-family: monospace; font-size: 18px;">${password}</span></p>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">⚠️ <b>Important:</b> Please change your password after first login for security reasons.</p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">If you have any questions, please contact the school administration.</p>
            
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated message from Education CRM. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await sendOrSkip(transporter, mailOptions, `Parent credentials email sent to ${to} for student ${studentName}`);
    return true;
  } catch (error) {
    console.log("Email Error:", error);
    return false;
  }
};

// Send OTP for Parent Forgot Password
export const sendParentResetOtpEmail = async (to, otp, parentName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Education CRM" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Password Reset OTP - Parent Portal`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Parent Portal - Password Reset</h2>
          <p>Hello <b>${parentName}</b>,</p>
          <p>Use the following OTP to reset your password for accessing your ward's details:</p>
          <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    await sendOrSkip(transporter, mailOptions, `Parent reset OTP email sent to ${to}`);
    return true;
  } catch (error) {
    console.log("Parent reset OTP Email Error:", error);
    return false;
  }
};

// Send Fee Reminder Email to Parent
export const sendParentFeeReminderEmail = async (to, parentName, studentName, pendingAmount, nextDueDate) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const formattedAmount = typeof pendingAmount === "number"
      ? `₹${pendingAmount.toLocaleString("en-IN")}`
      : pendingAmount;

    const dueText = nextDueDate
      ? new Date(nextDueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "upcoming schedule";

    const mailOptions = {
      from: `"Education CRM" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Fee Reminder - ${studentName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background: #f9fafb;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px 28px; border-radius: 16px 16px 0 0; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px;">Fee Reminder</h1>
            <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">For ward: <strong>${studentName}</strong></p>
          </div>

          <div style="background: #ffffff; padding: 24px 28px 20px; border-radius: 0 0 16px 16px; box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);">
            <p style="font-size: 15px; color: #374151; margin: 0 0 12px;">Dear <b>${parentName}</b>,</p>
            <p style="font-size: 14px; color: #4b5563; margin: 0 0 16px;">
              This is a gentle reminder that there is an <b>outstanding fee balance</b> for your ward
              <b>${studentName}</b> in the current academic session.
            </p>

            <div style="background: #f3f4ff; border-radius: 10px; padding: 16px 18px; margin-bottom: 18px; border: 1px solid #e0e7ff;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #1f2937;">
                <span style="font-weight: 600;">Pending Amount</span>
                <span style="font-weight: 700; color: #ef4444;">${formattedAmount}</span>
              </div>
              <div style="margin-top: 6px; font-size: 12px; color: #6b7280;">
                Next due date (if applicable): <b>${dueText}</b>
              </div>
            </div>

            <p style="font-size: 13px; color: #4b5563; margin: 0 0 10px;">
              Kindly clear the dues at the earliest as per the school&apos;s fee policy.
              If you have already made the payment, please ignore this message.
            </p>

            <p style="font-size: 12px; color: #9ca3af; margin: 18px 0 0; border-top: 1px solid #e5e7eb; padding-top: 12px;">
              This is an automated reminder from <b>Education CRM</b>. For any discrepancy or clarification,
              please contact the school accounts office.
            </p>
          </div>
        </div>
      `,
    };

    await sendOrSkip(transporter, mailOptions, `Parent fee reminder email sent to ${to} for student ${studentName}`);
    return true;
  } catch (error) {
    console.log("Parent fee reminder Email Error:", error);
    return false;
  }
};

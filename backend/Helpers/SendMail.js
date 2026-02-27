import nodemailer from "nodemailer";

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

    await transporter.sendMail(mailOptions);
    console.log("Manager password email sent successfully");
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

    await transporter.sendMail(mailOptions);
    console.log("Manager password email sent successfully");
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

    await transporter.sendMail(mailOptions);
    console.log(`${role} credentials email sent to ${to}`);
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

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${to}`);
    return true;
  } catch (error) {
    console.log("OTP Email Error:", error);
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

    await transporter.sendMail(mailOptions);
    console.log(`Parent credentials email sent to ${to} for student ${studentName}`);
    return true;
  } catch (error) {
    console.log("Email Error:", error);
    return false;
  }
};

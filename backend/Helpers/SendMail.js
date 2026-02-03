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
            <p style="margin: 5px 0;"><b>Portal URL:</b> <a href="${process.env.FRONTEND_URL}/login">Login Here</a></p>
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

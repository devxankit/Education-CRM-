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

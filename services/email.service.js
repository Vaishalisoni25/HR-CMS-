import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { success } from "zod";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    // secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("SMTP OK");
    }
  });
  await transporter.sendMail({
    from: `"Human Resource" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};

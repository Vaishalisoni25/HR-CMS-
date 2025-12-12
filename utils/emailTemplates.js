import { date } from "zod";
import { formatFullDate } from "./date.js";

export const employeeEmailTemplate = {
  created: ({ name, date, email, loginPassword }) => `
       <h2>Welcome to Company</h2>
    <p>Dear <b>${name}</b>,</p>

    <p>Your employee account has been created successfully.</p>

    <p>Date: <b>${date}</b></p>
    <p><b>Login Email:</b> ${email}</p>
    <p><b>Your Password:</b> ${loginPassword}</p>

    <p>You can log in using the provided credentials.</p>

    <p>Regards,<br>HR Team</p>
  `,
};
export const leaveEmailTemplate = {
  approved: ({ name, date }) => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
        <p>Dear <b>${name}</b>,</p>
        <p>Your leave has been <b>APPROVED</b>.</p>
        <p>Date: <b>${date}</b></p>
        <br/>
        <p>Best Regards,<br>HR Team</p>
    </div>
  `,
};

export const salaryEmailTemplate = {
  generated: ({ name, date, earnings, deductions, netSalary }) => `
       
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color:#2d89ef;">Salary Slip - ${date}</h2>

    <p>Dear <b>${name}</b>,</p>

    <p>Your salary for the month of <b>${date}</b> has been successfully processed.</p>

    <h3 style="color:#444;">Earnings</h3>
    <ul>
      <li><b>Basic Salary:</b> ₹${earnings.basic_salary}</li>
      <li><b>Bonus:</b> ₹${earnings.bonus}</li>
      <li><b>Overtime:</b> ₹${earnings.overtime}</li>
      <li><b>Paid Leave Encashment:</b> ₹${earnings.leaveEncashment}</li>
      <li><b>Other Adjustments:</b> ₹${earnings.otherAdjustment}</li>
    </ul>

    <h3 style="color:#444;">Deductions</h3>
    <ul>
      <li><b>PF (12%):</b> ₹${deductions.pf}</li>
      <li><b>LWP Deduction:</b> ₹${deductions.lwp_deduction}</li>
      <li><b>TDS:</b> ₹${deductions.tds}</li>
    </ul>

    <h2 style="color:green;">Net Salary: ₹${netSalary}</h2>

    <br>
    <p>Best Regards,<br><b>HR Team</b></p>
  </div>
  `,
};

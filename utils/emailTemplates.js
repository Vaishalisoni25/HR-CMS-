import { SALARY_COMPONENT } from "../config/constant.js";
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
      <li><b>Basic Salary:</b> ₹${earnings[SALARY_COMPONENT.BASIC_SALARY]}</li>
<li><b>Bonus:</b> ₹${earnings[SALARY_COMPONENT.BONUS]}</li>
<li><b>Overtime:</b> ₹${earnings[SALARY_COMPONENT.OVERTIME]}</li>
<li><b>Paid Leave Encashment:</b> ₹${
    earnings[SALARY_COMPONENT.LEAVE_ENCASHMENT]
  }</li>
<li><b>Other Adjustments:</b> ₹${
    earnings[SALARY_COMPONENT.OTHER_ADJUSTMENTS]
  }</li>

    </ul>

    <h3 style="color:#444;">Deductions</h3>
    <ul>
     <li><b>PF:</b> ₹${deductions[SALARY_COMPONENT.PF]}</li>
<li><b>Professional Tax:</b> ₹${
    deductions[SALARY_COMPONENT.PROFESSIONAL_TAX]
  }</li>
<li><b>LWP Deduction:</b> ₹${deductions[SALARY_COMPONENT.LWP_DEDUCTION]}</li>
<li><b>TDS:</b> ₹${deductions[SALARY_COMPONENT.TDS]}</li>

    </ul>

    <h2 style="color:green;">Net Salary: ₹${netSalary}</h2>

    <br>
    <p>Best Regards,<br><b>HR Team</b></p>
  </div>
  `,
};

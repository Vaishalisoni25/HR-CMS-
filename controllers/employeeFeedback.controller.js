import EmployeeFeedBack from "../models/employeeFeedback.model.js";
import Employee from "../models/employee.model.js";
import { ROLES, EMAIL_STATUS } from "../config/constant.js";
import { employeeFeedbackTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../services/email.service.js";

export async function createEmployeeFeedback(req, res, next) {
  try {
    if (![ROLES.HR, ROLES.SUPERADMIN].includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Only HR & Super admin can Feedback" });
    }
    const employeeId = req.params.id;
    const { type, subject, content, rating, emailStatus } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const existingFeedback = await EmployeeFeedBack.findOne({
      type,
      subject,
    });
    if (!existingFeedback) {
      return res
        .status(400)
        .json({ message: "Feedback already exists for this employee" });
    }

    const feedback = await EmployeeFeedBack.create({
      employeeId,
      type,
      subject,
      content,
      rating,
      emailStatus,
    });
    const emailHtml = employeeFeedbackTemplate({
      name: employee.name,
      subject: feedback.subject,
      content: feedback.content,
      rating: feedback.rating,
    });

    await sendEmail({
      to: employee.email,
      subject: "New FeedBack from HR",
      html: emailHtml,
    });
    feedback.emailStatus = EMAIL_STATUS.SENT;
    feedback.emailID = null;
    await feedback.save();
    res.status(201).json({
      success: true,
      message: "Feedback added & email sent",
      data: feedback,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllEmployeesFeedback(_req, res, next) {
  try {
    const feedback = await EmployeeFeedBack.find().lean();
    res.json({
      success: true,
      message: "All Employees Feedback fetched successfully",
      data: feedback,
    });
  } catch (err) {
    next(err);
  }
}

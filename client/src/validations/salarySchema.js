// validation/salarySchema.js
import * as yup from "yup";

export const salarySchema = yup.object({
  employeeId: yup.string().required("Please select an employee"),
  salary: yup
    .number()
    .typeError("Salary must be a number")
    .positive("Salary must be greater than 0")
    .required("Salary is required"),
  dateRange: yup.object({
    startDate: yup.date().nullable().required("Start date is required"),
    endDate: yup.date().nullable().required("End date is required"),
  }),
});

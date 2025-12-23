import { Schema, model } from "mongoose";

const EmployeeFeedbackSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  type: {},
});

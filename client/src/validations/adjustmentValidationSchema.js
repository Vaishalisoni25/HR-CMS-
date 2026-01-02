import * as Yup from "yup";

export const adjustmentSchema = Yup.object().shape({
  employee: Yup.string().required("Employee is required"),
  month: Yup.string().required("Month is required"),
  year: Yup.string().required("Year is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  type: Yup.string().required("Add/Less type is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed()
    .nullable()
    .required("Image is required"), 
});

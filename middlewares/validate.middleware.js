import { ZodError } from "zod";

const validate = (schema) => (req, _res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    next(err); // send to global error handler
  }
};

export default validate;

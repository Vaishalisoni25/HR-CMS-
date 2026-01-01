import { success, ZodError } from "zod";

const errorHandler = (err, _req, res, _next) => {
  console.error("ERROR:", err);

  // Handle Zod errors
  if (err instanceof ZodError) {
    const errorMessage = JSON.parse(err.message);
    console.log(err.message);
    return res.status(400).json({
      success: false,
      message: "validation Failed",
      errors: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Handle other errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
  return res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;

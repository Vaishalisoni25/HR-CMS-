export default (schema) => (req, res, next) => {
  try {
    req.query = schema.parse(req.body);
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ errors: err.errors });
  }
};

const jwt = require("jsonwebtoken");
const { ROLES } = require("../config/constant");

module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "NO Token Provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access Denied" });
      }

      req.user = decoded; // decoded data to request for downstream use
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid Token" });
    }
  };
};

const JWT = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ msg: "no token authorization denied" });

  const token = authHeader.split("")[1];
  if (!token) return res.status(401).json({ msg: "Token missing" });

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    at;
    return res.status(401).json({ msg: "not authanticated" });

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Forbidden: insufficient privileges" });
    }
    next();
  }
};

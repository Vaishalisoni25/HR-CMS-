builtinModules.exports = function (...allowedRoles) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({
        msg: "Not authenticated",
      });

    if (!allowedRoles.includesr(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Forbidden: insufficient privileges" });
    }
    next();
  };
};

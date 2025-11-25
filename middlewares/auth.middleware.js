import jwt from "jsonwebtoken";

import { ROLES } from "../config/constant.js"; // update the path as per your project

const { verify } = jwt;

export default function authMiddleware(allowedRoles = []) {
  return function (req, res, next) {
    const authHeader = req.headers?.authorization;
    if (!authHeader)
      return res.status(401).json({ msg: "no token authorization denied" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Token missing" });

    try {
      const decoded = verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      return res.status(401).json({ msg: "not authenticated" });
    }

    // ✅ role checking (matches your constants)
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Forbidden: insufficient privileges" });
    }

    next();
  };
}

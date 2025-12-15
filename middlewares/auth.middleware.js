import jwt from "jsonwebtoken";

import { ROLES } from "../config/constant.js";

const { verify } = jwt;

export default function authMiddleware(allowedRoles = []) {
  return function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token Missing" });
    }

    const token = authHeader.startsWith("Bearer")
      ? authHeader.split(" ")[1]
      : authHeader;
    console.log(token);

    if (!token) return res.status(401).json({ msg: "Token missing" });

    try {
      const decoded = verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.log(err);
      return res.status(401).json({ msg: "not authenticated" });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied" });
    }

    next();
  };
}

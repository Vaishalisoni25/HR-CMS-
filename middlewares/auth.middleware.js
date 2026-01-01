import jwt from "jsonwebtoken";
import { customError } from "../utils/customError.js";

import { ROLES } from "../config/constant.js";

const { verify } = jwt;

export default function authMiddleware(allowedRoles = []) {
  return function (req, res, next) {
    const token = req.headers["authorization"];

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

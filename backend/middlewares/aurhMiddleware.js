// authMiddleware.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies.accessToken; // ✅ read token from cookie
  if (!token) return res.status(401).json({ message: "Not authenticated gay" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};

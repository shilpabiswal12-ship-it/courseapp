import jwt from "jsonwebtoken";
import config from "../config.js";

function userMiddleware(req, res, next) {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
  token = req.cookies.token;
}

  if (!token) {
    return res.status(401).json({ errors: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("Error in middleware:", error);
    return res.status(401).json({ errors: "Invalid token or expired" });
  }
}

export default userMiddleware;
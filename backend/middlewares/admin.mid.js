import jwt from "jsonwebtoken";
import config from "../config.js";

function adminMiddleware(req, res, next) {
   let token;
   const authHeader = req.headers.authorization;
   console.log("Auth Header:", authHeader);
   console.log("Cookies received:", req.cookies);

   if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
   } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
   }

   if (!token) {
      console.log("No token found in either header or cookies");
      return res.status(401).json({ errors: "No token provided" });
   }

   try {
      const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD);
      console.log("Decoded Token Data:", decoded);
      req.adminId = decoded.id;
      next();
   } catch (error) {
      console.log("JWT Verification Error:", error.message);
      return res.status(401).json({ errors: "Invalid token or expired" });
   }
}

export default adminMiddleware;
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Log the full header for debugging
  console.log("Authorization header:", authHeader);

  const token = authHeader?.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded token:", decoded); // Should contain user_id
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token expired", 
        error: "TOKEN_EXPIRED",
        expiredAt: err.expiredAt 
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: "Invalid token", 
        error: "INVALID_TOKEN" 
      });
    }
    
    res.status(403).json({ 
      message: "Token verification failed", 
      error: err.message 
    });
  }
}

import jwt from 'jsonwebtoken';
export function verifyToken(token) {    
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.email;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

'use server';
import jwt from 'jsonwebtoken';
export async function verifyToken(token) {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return decoded ;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
}
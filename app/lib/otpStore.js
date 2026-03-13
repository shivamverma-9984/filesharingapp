// Shared in-memory OTP store using global to survive Next.js module isolation.
// Next.js can create separate module instances per API route, so a plain `new Map()`
// would give each route its own independent copy. Attaching to `global` ensures
// all routes share the exact same Map in the same Node.js process.
// In production with multiple instances, replace this with Redis or DynamoDB.

if (!global._otpStore) {
  global._otpStore = new Map(); // key: email, value: { otp, expiresAt }
}

const otpStore = global._otpStore;

export default otpStore;

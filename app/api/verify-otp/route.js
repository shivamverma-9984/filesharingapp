import { NextResponse } from "next/server";
import otpStore from "../../lib/otpStore";

export async function POST(request) {
  const { email, otp, type } = await request.json();
  // type: "reset" (forgot password) or undefined/anything else (registration)

  if (!email || !otp) {
    return NextResponse.json(
      { error: "Email and OTP are required" },
      { status: 400 },
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // Use prefixed key for password resets, plain key for registration
  const storeKey =
    type === "reset" ? `reset_${normalizedEmail}` : normalizedEmail;

  const record = otpStore.get(storeKey);

  if (!record) {
    return NextResponse.json(
      { error: "No OTP found for this email. Please request a new OTP." },
      { status: 400 },
    );
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(storeKey);
    return NextResponse.json(
      { error: "OTP has expired. Please request a new one." },
      { status: 400 },
    );
  }

  if (record.otp !== String(otp).trim()) {
    return NextResponse.json(
      { error: "Invalid OTP. Please try again." },
      { status: 400 },
    );
  }

  // OTP is valid — delete it so it cannot be reused
  otpStore.delete(storeKey);

  return NextResponse.json(
    { message: "OTP verified successfully", verified: true },
    { status: 200 },
  );
}

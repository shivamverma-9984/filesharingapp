import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { client } from "../../utils/dynamodbConfig";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import otpStore from "../../lib/otpStore";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // Verify the user EXISTS in the database (opposite of registration check)
  try {
    const scanCmd = new ScanCommand({
      TableName: process.env.AWS_DYNAMODB_USER_TABLE_NAME,
      ProjectionExpression: "email, authType",
    });
    const result = await client.send(scanCmd);

    const userRecord = result.Items?.find((it) => {
      const stored = it?.email?.S || "";
      return String(stored).trim().toLowerCase() === normalizedEmail;
    });

    if (!userRecord) {
      return NextResponse.json(
        { error: "No account found with this email address." },
        { status: 404 },
      );
    }

    // Prevent password reset for Google OAuth accounts
    if (userRecord?.authType?.S === "google") {
      return NextResponse.json(
        {
          error: "This account uses Google Sign-In. Please log in with Google.",
        },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("DynamoDB lookup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Use a different key prefix to separate from registration OTPs
  otpStore.set(`reset_${normalizedEmail}`, { otp, expiresAt });

  try {
    await transporter.sendMail({
      from: `"fileSharing" <${process.env.GMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your OTP for Password Reset",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8" /><title>Password Reset OTP</title></head>
        <body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(28,118,235,0.08);overflow:hidden;">
                  <tr>
                    <td style="background:linear-gradient(135deg,#1c76eb,#0d4fa0);padding:36px 40px;text-align:center;">
                      <h1 style="color:#ffffff;margin:0;font-size:26px;letter-spacing:1px;">fileSharing</h1>
                      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Password Reset Request</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="color:#1e1b4b;margin:0 0 8px;font-size:22px;">Reset Your Password</h2>
                      <p style="color:#6b7280;margin:0 0 28px;font-size:15px;line-height:1.6;">
                        Use the OTP below to reset your password. It is valid for <strong>10 minutes</strong>.
                      </p>
                      <div style="background:#eff6ff;border:2px dashed #1c76eb;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
                        <p style="margin:0 0 6px;color:#1c76eb;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">One-Time Password</p>
                        <p style="margin:0;font-size:42px;font-weight:800;color:#1c76eb;letter-spacing:10px;">${otp}</p>
                      </div>
                      <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0;">
                        If you did not request a password reset, please ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
                      <p style="margin:0;color:#9ca3af;font-size:12px;">© 2025 fileSharing. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json(
      {
        error:
          "Failed to send OTP email. Please check your email configuration.",
      },
      { status: 500 },
    );
  }
}

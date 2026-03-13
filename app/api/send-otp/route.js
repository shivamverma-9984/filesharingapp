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

  // Check if user already exists
  try {
    const userExist = new ScanCommand({
      TableName: process.env.AWS_DYNAMODB_USER_TABLE_NAME,
      ProjectionExpression: "email",
    });
    const existingUser = await client.send(userExist);
    if (existingUser.Items && existingUser.Items.length > 0) {
      const exists = existingUser.Items.some((it) => {
        const stored = it?.email?.S || "";
        return String(stored).trim().toLowerCase() === normalizedEmail;
      });
      if (exists) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 },
        );
      }
    }
  } catch (err) {
    console.error("DynamoDB check error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(normalizedEmail, { otp, expiresAt });

  try {
    await transporter.sendMail({
      from: `"fileSharing" <${process.env.GMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your OTP for fileSharing Registration",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <title>OTP Verification</title>
        </head>
       <body class="bg-gray-100">
    <div class="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-indigo-600 py-6 px-8">
            <h1 class="text-3xl font-bold text-white text-center">Your OTP Code</h1>
        </div>
        <div class="p-8">
            <p class="text-gray-700 mb-4">Hello,</p>
            <p class="text-gray-700 mb-4">Your One-Time Password (OTP) for account verification is:</p>
            <div class="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-center">
                <p class="text-4xl font-bold text-center text-indigo-600 ">${otp}</p>
            </div>
            <p class="text-gray-700 mb-4">This OTP is valid for <span class="font-semibold">2 minutes</span>. Please do not share this code with anyone.</p>
            <p class="text-gray-700 mb-2">If you didn't request this code, please ignore this email.</p>
            <p class="text-gray-700">Thank you for using our service!</p>
        </div>
        <div class="bg-gray-100 py-4 px-8">
            <p class="text-sm text-gray-600 text-center">&copy; 2024 Your Company Name. All rights reserved.</p>
        </div>
    </div>
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

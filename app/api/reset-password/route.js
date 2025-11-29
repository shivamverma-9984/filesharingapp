import { NextResponse } from "next/server";
import crypto from "crypto";
import { ddb } from "@/app/lib/dynamodb";
import { UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const USERS_TABLE = process.env.AWS_DYNAMODB_TABLE_NAME;

export async function POST(req) {
  const { email } = await req.json();

  // 1️⃣ Check user existence
  const result = await ddb.send(
    new GetCommand({
      TableName: USERS_TABLE,
      Key: { email },
    })
  );

  if (!result.Item) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // 2️⃣ Generate token (random + expiration)
  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes

  // 3️⃣ Save token in DynamoDB
  await ddb.send(
    new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { email },
      UpdateExpression: "SET resetToken = :token, tokenExpiry = :expiry",
      ExpressionAttributeValues: {
        ":token": resetToken,
        ":expiry": tokenExpiry,
      },
    })
  );

  const NEXT_PUBLIC_BASE_URL="http://localhost:3000/resetpassword";     

  // 4️⃣ You can send this link via email (for demo, just return it)
  const resetLink = `${NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
  console.log("Password reset link:", resetLink);

  return NextResponse.json({
    message: "Password reset link generated.",
    resetLink, // ⚠️ In production, remove this and send via email
  });
}

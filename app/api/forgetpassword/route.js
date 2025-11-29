import { client } from "../../utils/dynamodbConfig";
import { ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password, confirmPassword } = await request.json();

  if (!email || !password || !confirmPassword) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // Find the user by scanning emails (normalize stored values) and get its id
  const scan = new ScanCommand({
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    ProjectionExpression: "id, email",
  });

  try {
    const scanResult = await client.send(scan);

    if (!scanResult.Items || scanResult.Items.length === 0) {
      return NextResponse.json({ message: "Invalid email" }, { status: 404 });
    }

    const match = scanResult.Items.find((it) => {
      const stored = it?.email?.S || "";
      return String(stored).trim().toLowerCase() === normalizedEmail;
    });

    if (!match) {
      return NextResponse.json({ message: "Invalid email" }, { status: 404 });
    }

    const userId = match.id.S;

    // Update the password for the matched user id
    const update = new UpdateItemCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      Key: { id: { S: userId } },
      UpdateExpression: "SET #pwd = :pwd",
      ExpressionAttributeNames: { "#pwd": "password" },
      ExpressionAttributeValues: { ":pwd": { S: password } },
      ReturnValues: "UPDATED_NEW",
    });

    const updateResult = await client.send(update);

    return NextResponse.json({ message: "Password updated successfully", updated: updateResult.Attributes }, { status: 200 });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ message: "Error updating password" }, { status: 500 });
  }
}

import { client } from "../../utils/dynamodbConfig";
import { PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

    const userExist = new ScanCommand({
      TableName: process.env.AWS_DYNAMODB_USER_TABLE_NAME,
      ProjectionExpression: "email",
    });
  try {
    const existingUser = await client.send(userExist);
     console.log("Existing users:", existingUser);
    if (existingUser.Items.length > 0) {
      const exists = existingUser.Items.some((it) => {
        const stored = it?.email?.S || "";
        return String(stored).trim().toLowerCase() === normalizedEmail;
      });
      if (exists) {
        return new NextResponse(JSON.stringify({ message: "User already exist" }), {
          status: 409,
        });
      }
    }

    const command = new PutItemCommand({
      TableName: process.env.AWS_DYNAMODB_USER_TABLE_NAME,
      Item: {
        id: { S: uuidv4() },
        name: { S: name },
        email: { S: normalizedEmail },
        password: { S: password },
      },
    });

    await client.send(command);
    return new Response(
      JSON.stringify({ message: "User registered successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(JSON.stringify({ error: "Error registering user" }), {
      status: 500,
    });
  }
}

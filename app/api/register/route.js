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

  const userExist = new ScanCommand({
    TableName: process.env.AWS_S3_TABLE_NAME,
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": { S: email }
    },
    Limit: 1
  });
  try {
    const existingUser = await client.send(userExist);

    if (existingUser && existingUser.Items && existingUser?.Items?.length > 0) {
      return new NextResponse(JSON.stringify({ message: "User already exist" }), {
        status: 409,
      });
    }

    const command = new PutItemCommand({
      TableName: process.env.AWS_S3_TABLE_NAME,
      Item: {
        id: { S: uuidv4() },
        name: { S: name },
        email: { S: email },
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

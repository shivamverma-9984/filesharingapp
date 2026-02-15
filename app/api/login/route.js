import { client } from "../../../app/utils/dynamodbConfig";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists with given email and password
    const command = new ScanCommand({
      TableName: process.env.AWS_DYNAMODB_USER_TABLE_NAME,
      FilterExpression: "email = :email AND password = :password",
      ExpressionAttributeValues: {
        ":email": { S: email },
        ":password": { S: password }
      }
    });

    const result = await client.send(command);

    if (!result.Items || result.Items.length === 0) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = {
      id: result.Items[0].id.S,
      email: result.Items[0].email.S,
      name: result.Items[0].name.S
    };

    // Create response with cookies
    const response = NextResponse.json(
      { message: "Login successful", user },
      { status: 200 }
    );


    const token=  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
     
    // Set cookies for authentication
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    };

    response.cookies.set('token', token, cookieOptions);

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Error during login" },
      { status: 500 }
    );
  }
}

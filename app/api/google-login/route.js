
import { client } from "../../../app/utils/dynamodbConfig";
import { ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_SECRET_ID);

export async function POST(request) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { message: "Google credential is required" },
        { status: 400 }
      );
    }

    // Verify Google Token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    // Check if user exists
    const scanCommand = new ScanCommand({
      TableName: process.env.AWS_DYNAMODB_USER_TABLE_NAME,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: email }
      }
    });

    const result = await client.send(scanCommand);
    let user;

    if (!result.Items || result.Items.length === 0) {
      // Create new user if not exists
      const newUserId = uuidv4();
      
      const putCommand = new PutItemCommand({
        TableName: process.env.AWS_DYNAMODB_USER_TABLE_NAME,
        Item: {
          id: { S: newUserId },
          email: { S: email },
          name: { S: name },
          googleId: { S: googleId },
          authType: { S: 'google' },
          createdAt: { S: new Date().toISOString() },
          // optional: picture: { S: picture }
        }
      });

      await client.send(putCommand);

      user = {
        id: newUserId,
        email: email,
        name: name
      };
    } else {
      // User exists
      user = {
        id: result.Items[0].id.S,
        email: result.Items[0].email.S,
        name: result.Items[0].name.S
      };
    }

    // Generate JWT Token (same as regular login)
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
     
    // Set cookies
    const response = NextResponse.json(
      { message: "Login successful", user },
      { status: 200 }
    );

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
    console.error("Google Login error:", error);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 500 }
    );
  }
}

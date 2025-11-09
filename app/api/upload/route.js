import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { s3 } from "@/app/utils/s3config";
import { client } from "@/app/utils/dynamodbConfig";
import { v4 as uuidv4 } from "uuid";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    // check auth cookies first
 
const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
   
  if (!token) return null;
   let data;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    data = { id: decoded.id, email: decoded.email };
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
  const userEmail= data.email;

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate a unique filename to prevent overwriting
    const uniqueFileName = `${userEmail}/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    });

    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION || "ap-south-1"}.amazonaws.com/${uniqueFileName}`;

    // Validate table name
    const tableName = process.env.AWS_S3_FILES_TABLE_NAME;
    if (!tableName) {
      console.error("Missing AWS_S3_FILES_TABLE_NAME environment variable");
      return NextResponse.json(
        { error: "Server configuration error: Missing table name" },
        { status: 500 }
      );
    }

    // Store file information in DynamoDB
    const fileCommand = new PutItemCommand({
      TableName: tableName,
      Item: {
        id: { S: uuidv4() },
        filename: { S: file.name },
        url: { S: fileUrl },
        size: { S: buffer.length.toString() },
        uploadDate: { S: new Date().toISOString() },
        userEmail: { S: userEmail }
      }
    });

    await client.send(fileCommand);
    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileDetails: {
        filename: file.name,
        size: buffer.length,
        uploadDate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage = error.name === 'ValidationException' 
      ? 'Database configuration error: Please check environment variables'
      : 'Upload failed';
    return NextResponse.json({ error: errorMessage, details: error.message }, { status: 500 });
  }
}
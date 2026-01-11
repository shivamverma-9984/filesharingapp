import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { cookies } from "next/headers";
import { client } from "../../../app/utils/dynamodbConfig";
import { s3 } from "../../utils/s3config";
import { verifyToken } from "../../../app/helper/verifyToken";

export async function DELETE(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userEmail = verifyToken(token);
  if (!userEmail) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
    });
  }

  try {
    const { fileId, fileUrl } = await request.json();
    console.log('Delete request:', { fileId, fileUrl });

    // Extract key from URL
    const url = new URL(fileUrl);
    const fileKey = url.pathname.substring(1); // Remove leading slash
    console.log('Extracted key:', fileKey);

    // Delete from S3
    const deleteS3Command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    });
    await s3.send(deleteS3Command);
    console.log('S3 delete successful');

    // Delete from DynamoDB
    const deleteDynamoCommand = new DeleteItemCommand({
      TableName: process.env.AWS_DYNAMODB_DATA_TABLE_NAME,
      Key: {
        id: { S: fileId },
      },
    });
    await client.send(deleteDynamoCommand);
    console.log('DynamoDB delete successful');

    return new Response(JSON.stringify({ message: "File deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete file", details: error.message }), {
      status: 500,
    });
  }
}
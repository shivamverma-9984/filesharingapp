import { client } from "@/app/utils/dynamodbConfig";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;
    let data;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      data = { id: decoded.id, email: decoded.email };
    } catch (err) {
      console.error("Invalid token:", err);
      return null;
    }

    const userEmail = data.email;

    console.log("userEmail->>>", userEmail);

    const command = new ScanCommand({
      TableName: process.env.AWS_S3_FILES_TABLE_NAME,
      FilterExpression: "userEmail = :email",
      ExpressionAttributeValues: {
        ":email": { S: userEmail },
      },
    });

    const result = await client.send(command);

    const files = result.Items
      ? result.Items.map((item) => ({
          id: item.id.S,
          filename: item.filename.S,
          url: item.url.S,
          size: item.size.S,
          uploadDate: item.uploadDate.S,
          userEmail: item.userEmail.S,
        }))
      : [];

    return new Response(JSON.stringify({ files }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    return new Response(JSON.stringify({ error: "Error fetching files" }), {
      status: 500,
    });
  }
}

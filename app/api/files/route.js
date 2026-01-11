import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { cookies } from "next/headers";
import { client } from "../../../app/utils/dynamodbConfig";
import { verifyToken } from "../../../app/helper/verifyToken";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  let userEmail = verifyToken(token);
  if (!userEmail) return null;

  try {

    const command = new ScanCommand({
      TableName: process.env.AWS_DYNAMODB_DATA_TABLE_NAME,
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
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

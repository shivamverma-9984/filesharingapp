import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../utils/s3config";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('key');
    const filename = searchParams.get('filename');

    if (!fileKey || !filename) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    });

    const response = await s3.send(command);
    const stream = response.Body;
    
    return new NextResponse(stream, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': response.ContentType || 'application/octet-stream',
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Download failed", details: error.message }, { status: 500 });
  }
}
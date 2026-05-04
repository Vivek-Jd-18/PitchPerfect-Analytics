import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const REGION = process.env.AWS_REGION || 'us-east-1';
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME as string;

// Initialize the Amazon S3 Client securely
const s3Client = new S3Client({
  region: REGION,
  // If running on EC2/ECS/Lambda with IAM roles, credentials are automatically picked up.
  // Otherwise, they fallback to AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env vars.
});

/**
 * Uploads a player's headshot to the configured S3 bucket.
 * 
 * @param playerId The UUID of the player.
 * @param fileBuffer The raw image file buffer.
 * @param mimeType The image MIME type (e.g., 'image/png').
 * @returns The S3 object key or URL path.
 */
export const uploadPlayerHeadshot = async (
  playerId: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<string> => {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not defined in environment variables.');
  }

  const fileExtension = mimeType.split('/')[1] || 'png';
  const objectKey = `players/headshots/${playerId}-${Date.now()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
    Body: fileBuffer,
    ContentType: mimeType,
    // Optional: ACL can be added if the bucket allows it, but bucket policies are preferred.
    // ACL: 'public-read', 
  });

  try {
    await s3Client.send(command);
    console.log(`✅ Successfully uploaded headshot for player ${playerId} to S3.`);
    
    // Return the constructed S3 URL
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${objectKey}`;
  } catch (error) {
    console.error(`❌ Failed to upload headshot for player ${playerId}:`, error);
    throw new Error('S3 Upload Failed');
  }
};

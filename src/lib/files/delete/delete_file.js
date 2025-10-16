import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

dotenv.config();

// Credentials
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucket_name = process.env.AWS_S3_BUCKET_NAME;
const s3_endpoint = process.env.AWS_S3_ENDPOINT; // Optional custom endpoint

export const delete_file = async (url) => {
    return new Promise((resolve, reject) => {
        // Credentials of S3
        const s3Client = new S3Client({
            ...(s3_endpoint && { endpoint: s3_endpoint }), // Only add endpoint if custom endpoint is provided
            region: region,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
            ...(s3_endpoint && { forcePathStyle: true }), // Only use forcePathStyle for custom endpoints
        });

        try {
            // Parse the file URL to extract the object key
            const parsedUrl = new URL(url);
            const objectKey = parsedUrl.pathname.split("/").pop();

            // Create the deleteObject command
            const deleteParams = {
                Bucket: bucket_name,
                Key: objectKey,
            };

            const deleteCommand = new DeleteObjectCommand(deleteParams);
            s3Client.send(deleteCommand)
                    .then((data) => {
                        resolve("File deleted successfully!")
                    })
                    .catch((error) => {
                        console.error("Error deleting files:" + error);
                        reject(error);
                    });
        } catch (e) {
            reject(e);
        }
    });
};
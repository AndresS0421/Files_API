import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

dotenv.config();

// Credentials
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const minio_endpoint = 'http://localhost:9000';

export const delete_file = async (url) => {
    return new Promise((resolve, reject) => {
        // Credentials of S3
        const s3Client = new S3Client({
            endpoint: minio_endpoint,
            region: region,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
            forcePathStyle: true, // Necessary for MinIO
        });

        try {
            // Parse the file URL to extract the object key
            const parsedUrl = new URL(url);
            const objectKey = parsedUrl.pathname.split("/").pop();

            // Create the deleteObject command
            const deleteParams = {
                Bucket: "thesis",
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
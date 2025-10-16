import fs from 'fs';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { get_content_type } from './get_content_type/get_content_type.js';

dotenv.config();

// Credentials
const access_key_id = process.env.AWS_ACCESS_KEY;
const secret_access_key = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucket_name = process.env.AWS_S3_BUCKET_NAME;
const s3_endpoint = process.env.AWS_S3_ENDPOINT; // Optional custom endpoint

export const upload_to_bucket = async (file, filename) => {
    return new Promise((resolve, reject) => {
        // Create S3 client for AWS S3
        const s3_client = new S3Client({
            ...(s3_endpoint && { endpoint: s3_endpoint }), // Only add endpoint if custom endpoint is provided
            region: region,
            credentials: {
                accessKeyId: access_key_id,
                secretAccessKey: secret_access_key,
            },
            ...(s3_endpoint && { forcePathStyle: true }), // Only use forcePathStyle for custom endpoints
        });

        if (!Array.isArray(file)) {
            return reject(new Error('File argument must be an array of files.'));
        }

        // Collecting Attributes of File
        const uploaded_file = file[0];
        const file_path = uploaded_file.filepath;
        const content_type = get_content_type(uploaded_file.originalFilename.split('.').pop()) || 'application/octet-stream';

        // Read the file content into a Buffer
        const file_content = fs.readFileSync(file_path);

        // Upload to AWS S3 bucket
        const put_command = new PutObjectCommand({
            Bucket: bucket_name,
            Key: `${filename}`,
            Body: file_content,
            ContentType: content_type,
            // Note: ACL is deprecated for new buckets, use bucket policies instead
        });

        s3_client
            .send(put_command)
            .then((data) => {
                // Construct the S3 URL
                const location = s3_endpoint 
                    ? `${s3_endpoint}/${bucket_name}/${filename}` // Custom endpoint
                    : `https://${bucket_name}.s3.${region}.amazonaws.com/${filename}`; // Standard AWS S3 URL
                resolve({ ...data, location });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

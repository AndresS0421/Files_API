import fs from 'fs';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { get_content_type } from './get_content_type/get_content_type.js';

dotenv.config();

// Credentials
const access_key_id = process.env.AWS_ACCESS_KEY;
const secret_access_key = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION
const minio_endpoint = 'http://localhost:9000'; // Your MinIO server endpoint

export const upload_to_bucket = async (file, filename) => {
    return new Promise((resolve, reject) => {
        // Create S3 client for MinIO
        const s3_client = new S3Client({
            endpoint: minio_endpoint,
            region: region,
            credentials: {
                accessKeyId: access_key_id,
                secretAccessKey: secret_access_key,
            },
            forcePathStyle: true, // Necessary for MinIO
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

        // Upload to MinIO bucket
        const put_command = new PutObjectCommand({
            Bucket: "thesis",
            Key: `${filename}`,
            Body: file_content,
            ACL: 'public-read', // Adjust based on your MinIO bucket policies
            ContentType: content_type,
        });

        s3_client
            .send(put_command)
            .then((data) => {
                const location = `${minio_endpoint}/thesis/${filename}`; // URL to access the file
                resolve({ ...data, location });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

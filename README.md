# Files API

A Node.js REST API for managing file uploads, storage, and categorization using AWS S3 and PostgreSQL.

## 🚀 Features

- **File Upload & Storage**: Upload files to AWS S3 with automatic URL generation
- **File Management**: CRUD operations for files with metadata
- **Category Management**: Organize files by categories
- **Database Integration**: PostgreSQL with Prisma ORM
- **Cloud Storage**: AWS S3 integration for scalable file storage
- **RESTful API**: Clean REST endpoints for all operations

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- AWS S3 bucket
- AWS credentials (Access Key ID and Secret Access Key)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Files_API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

   # Server Configuration
   PORT=8090

   # AWS S3 Configuration
   AWS_ACCESS_KEY=your_aws_access_key_here
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
   AWS_REGION=your_aws_region_here
   AWS_S3_BUCKET_NAME=your_bucket_name_here

   # Optional: Custom S3 endpoint (for S3-compatible services)
   # AWS_S3_ENDPOINT=https://s3.amazonaws.com

   # JWT Configuration (if using authentication)
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   ACCESS_TOKEN_AGE=15m
   REFRESH_TOKEN_AGE=7d
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev --name init
   ```

5. **Start the server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:8090`

## 📚 API Endpoints

### Files Management

#### Upload File
```http
POST /files/upload
Content-Type: multipart/form-data

Body:
- file: (file) - The file to upload
- file: (JSON string) - File metadata
  {
    "description": "File description",
    "user_id": "user123",
    "category_id": "cat456"
  }
```

#### Get All Files
```http
GET /files/get_all?role=ADMINISTRATOR
```

#### Get File by ID
```http
GET /files/get_by_id?file_id=file123&role=ADMINISTRATOR
```

#### Get Files by User ID
```http
GET /files/get_by_user_id?user_id=user123
```

#### Update File
```http
PUT /files/update
Content-Type: multipart/form-data

Body:
- file: (file, optional) - New file to replace existing
- file: (JSON string) - Updated file metadata
  {
    "user_id": "user123",
    "description": "Updated description",
    "category_id": "cat789"
  }
```

#### Delete File
```http
DELETE /files/delete?user_id=user123&file_id=file123
```

### Categories Management

#### Create Category
```http
POST /category/create
Content-Type: application/json

{
  "name": "Category Name",
  "description": "Category description (optional)"
}
```

#### Get All Categories
```http
GET /category/get_all
```

#### Get Category by ID
```http
GET /category/get_by_id?id=cat123
```

#### Update Category
```http
PUT /category/update?id=cat123
Content-Type: application/json

{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

#### Delete Category
```http
DELETE /category/delete?id=cat123
```

## 🗄️ Database Schema

### Files Table
```sql
model Files {
  id          String    @id @default(cuid())
  url         String    @db.VarChar(500)
  description String?   @db.VarChar(255)
  user_id     String    @db.VarChar(255)
  category_id String    @db.VarChar(255)
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt

  category    Categories  @relation(fields: [category_id], references: [id], onDelete: Cascade)
}
```

### Categories Table
```sql
model Categories {
  id          String    @id @default(cuid())
  name        String    @db.VarChar(50)
  description String?   @db.VarChar(255)
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt

  files Files[]
}
```

## 🔧 Configuration

### AWS S3 Setup

1. **Create an S3 bucket** in your AWS account
2. **Configure bucket permissions** for public read access (if needed)
3. **Create IAM user** with S3 permissions
4. **Get access credentials** and add them to your `.env` file

### Database Setup

1. **Create PostgreSQL database**
2. **Update DATABASE_URL** in your `.env` file
3. **Run migrations** to create tables

## 📁 Project Structure

```
Files_API/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── files/           # File-related controllers
│   │   └── category/        # Category-related controllers
│   ├── services/            # Business logic
│   │   ├── files/           # File services
│   │   └── category/        # Category services
│   ├── routes/              # API routes
│   ├── lib/                 # Utility libraries
│   │   ├── files/           # File handling utilities
│   │   ├── prisma/          # Database connection
│   │   └── errors/          # Error handling
│   └── routes/              # Route definitions
├── prisma/                  # Database schema and migrations
├── index.js                 # Application entry point
└── package.json
```

## 🚀 Usage Examples

### Upload a File
```bash
curl -X POST http://localhost:8090/files/upload \
  -F "file=@document.pdf" \
  -F 'file={"description":"My thesis document","user_id":"user123","category_id":"cat456"}'
```

### Get All Files
```bash
curl "http://localhost:8090/files/get_all?role=ADMINISTRATOR"
```

### Create a Category
```bash
curl -X POST http://localhost:8090/category/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Computer Science","description":"CS related documents"}'
```

## 🔒 Security Notes

- **Environment Variables**: Never commit your `.env` file
- **AWS Credentials**: Use IAM roles with minimal required permissions
- **File Validation**: Implement file type and size validation as needed
- **Access Control**: Add authentication middleware for production use

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Run `npx prisma generate` and `npx prisma migrate dev`

2. **S3 Upload Error**
   - Verify AWS credentials in `.env`
   - Check bucket name and region
   - Ensure bucket permissions are correct

3. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Or kill the process using port 8090

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
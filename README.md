# Thesis Files API

A comprehensive REST API for managing thesis files, users, and categories in an academic environment. Built with Node.js, Express, Prisma ORM, and AWS S3 for file storage.

## 🚀 Features

- **User Management**: Create users and handle authentication
- **Thesis Management**: Upload, retrieve, update, and delete thesis files
- **Category Management**: Organize theses by categories
- **File Storage**: Secure file upload to AWS S3
- **Role-based Access**: Different access levels for students, professors, and administrators
- **Database**: MySQL database with Prisma ORM

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Prisma ORM
- **File Storage**: AWS S3
- **Authentication**: bcrypt for password hashing
- **File Upload**: Formidable for multipart form data

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL database
- AWS S3 bucket
- Environment variables configured

## 🔧 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Files_API
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with the following variables:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
PORT=3000
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
```

4. Set up the database
```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the server
```bash
npm start
```

## 📚 API Endpoints

### User Endpoints

#### Create User
- **POST** `/user/create`
- **Description**: Create a new user account
- **Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "securepassword",
  "role": "STUDENT"
}
```
- **Response**:
```json
{
  "successful": true,
  "data": {
    "id": "user_id",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "STUDENT"
  }
}
```

#### User Login
- **POST** `/user/login`
- **Description**: Authenticate user and get user data
- **Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```
- **Response**:
```json
{
  "successful": true,
  "data": {
    "id": "user_id",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  }
}
```

### Category Endpoints

#### Create Category
- **POST** `/category/create`
- **Description**: Create a new thesis category (Admin only)
- **Body**:
```json
{
  "category": {
    "name": "Computer Science",
    "description": "Theses related to computer science"
  },
  "role": "ADMINISTRATOR"
}
```
- **Response**:
```json
{
  "successful": true,
  "data": {
    "id": "category_id",
    "name": "Computer Science",
    "description": "Theses related to computer science"
  }
}
```

#### Get All Categories
- **GET** `/category/get-all`
- **Description**: Retrieve all available categories
- **Response**:
```json
{
  "successful": true,
  "data": [
    {
      "id": "category_id",
      "name": "Computer Science",
      "description": "Theses related to computer science"
    }
  ]
}
```

#### Update Category
- **PUT** `/category/update`
- **Description**: Update an existing category (Admin only)
- **Body**:
```json
{
  "category": {
    "id": "category_id",
    "name": "Updated Category Name",
    "description": "Updated description"
  },
  "role": "ADMINISTRATOR"
}
```

#### Delete Category
- **DELETE** `/category/delete`
- **Description**: Delete a category (Admin only)
- **Body**:
```json
{
  "category_id": "category_id",
  "role": "ADMINISTRATOR"
}
```

### Thesis Endpoints

#### Upload Thesis
- **POST** `/thesis/upload`
- **Description**: Upload a thesis file with metadata
- **Content-Type**: `multipart/form-data`
- **Body**:
```
thesis: {
  "title": "My Thesis Title",
  "abstract": "Thesis abstract content...",
  "key_words": "keyword1, keyword2, keyword3",
  "user_id": "user_id",
  "category_id": "category_id"
}
thesis: [file] (PDF file)
```
- **Response**:
```json
{
  "successful": true,
  "data": {
    "id": "thesis_id",
    "title": "My Thesis Title",
    "author": "John Doe",
    "year": 2024,
    "abstract": "Thesis abstract content...",
    "key_words": "keyword1, keyword2, keyword3",
    "thesis_url": "https://s3.amazonaws.com/bucket/file.pdf"
  }
}
```

#### Get All Theses
- **GET** `/thesis/get-all`
- **Description**: Retrieve all theses
- **Response**:
```json
{
  "successful": true,
  "data": [
    {
      "id": "thesis_id",
      "title": "Thesis Title",
      "author": "Author Name",
      "year": 2024,
      "abstract": "Abstract content...",
      "key_words": "keywords",
      "thesisFiles": [
        {
          "id": "file_id",
          "thesis_url": "https://s3.amazonaws.com/bucket/file.pdf"
        }
      ]
    }
  ]
}
```

#### Get Thesis by ID
- **GET** `/thesis/get?thesis_id=thesis_id&role=ADMINISTRATOR`
- **Description**: Retrieve a specific thesis by ID (Admin/Professor only)
- **Query Parameters**:
  - `thesis_id`: The ID of the thesis
  - `role`: User role (ADMINISTRATOR or PROFESSOR)

#### Get Theses by User ID
- **GET** `/thesis/get-user-id?user_id=user_id`
- **Description**: Retrieve all theses uploaded by a specific user
- **Query Parameters**:
  - `user_id`: The ID of the user

#### Update Thesis
- **PUT** `/thesis/update`
- **Description**: Update thesis information
- **Body**:
```json
{
  "thesis_id": "thesis_id",
  "title": "Updated Title",
  "abstract": "Updated abstract...",
  "key_words": "updated, keywords"
}
```

#### Delete Thesis
- **DELETE** `/thesis/delete?user_id=user_id&thesis_id=thesis_id`
- **Description**: Delete a thesis and its associated files
- **Query Parameters**:
  - `user_id`: The ID of the user who owns the thesis
  - `thesis_id`: The ID of the thesis to delete

## 🔐 User Roles

- **STUDENT**: Can upload, view, update, and delete their own theses
- **PROFESSOR**: Can view all theses and specific thesis details
- **ADMINISTRATOR**: Full access to all operations including category management

## 📁 Database Schema

The API uses the following main entities:
- **Users**: User accounts with role-based access
- **Thesis**: Thesis documents with metadata
- **thesisFiles**: File references linked to theses
- **Categories**: Thesis categorization
- **Universities**: University information
- **Schools**: School/department information
- **Credentials**: User authentication credentials

## 🚨 Error Handling

All endpoints return consistent error responses:
```json
{
  "successful": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `405`: Method Not Allowed

## 🔧 Development

### Running in Development Mode
```bash
npm start
```

The server will start with nodemon for automatic restarts on file changes.

### Database Migrations
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

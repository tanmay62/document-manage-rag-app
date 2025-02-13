Document Management App - Project Documentation
==============================================

TABLE OF CONTENTS
-----------------
1. Project Overview
2. Tech Stack
3. Installation & Setup
4. Features
5. Q&A Functionality
6. Document Management
7. Cypress Test Cases
8. Running Cypress Tests
9. API Endpoints (Mock Service)
10. Troubleshooting

----------------------------------------------
1. PROJECT OVERVIEW
----------------------------------------------
The Document Management App is a web-based application built using Angular for the frontend and Node.js (Express) as the backend with a Mock Service API.

The app provides the following functionalities:
- User authentication (Signup & Login).
- Document upload and management.
- A Q&A section where users can ask questions and receive answers based on predefined mock data.

----------------------------------------------
2. TECH STACK
----------------------------------------------
FRONTEND (Angular)
- Angular
- Angular Forms
- Bootstrap

BACKEND (Node.js with Express - Mock API)
- Node.js
- Express.js
- CORS
- Multer (for file uploads)
- FS (File System)
- Path

----------------------------------------------
3. INSTALLATION & SETUP
----------------------------------------------
FRONTEND SETUP
1. Clone the repository:
   git clone <repo-url>
   cd document-management-app
2. Install Angular dependencies:
   npm install
3. Run the Angular project:
   ng serve
4. Access the application in the browser:
   http://localhost:4200

BACKEND SETUP
1. Navigate to the backend folder:
   cd backend
2. Install backend dependencies:
   npm install
3. Run the backend server:
   node server.js
4. The backend runs at:
   http://localhost:3000

----------------------------------------------
4. FEATURES
----------------------------------------------
1. User Authentication
- Signup with username, email, and password.
- Login using credentials.
- Redirects to Dashboard after login.

2. Q&A Section
- Users can ask questions.
- Based on keywords, relevant answers are fetched from a mock API.
- Displays the document name containing the answer.

3. Document Upload & Management
- Users can upload any type of document (PDF, DOCX, TXT, etc.).
- Uploaded documents appear in a list below the upload button.
- Actions:
  - View: Opens the document in a new tab.
  - Delete: Removes the document.

----------------------------------------------
5. Q&A FUNCTIONALITY
----------------------------------------------
- The Q&A section fetches answers from a mock JSON file (mockQnA.json).
- If a question matches a keyword, it returns:
  - A relevant answer.
  - The document where the answer is found.

----------------------------------------------
6. DOCUMENT MANAGEMENT
----------------------------------------------
- Uses Multer for handling file uploads.
- Uploaded files are stored in the backend/uploads folder.
- The document list is fetched from the server and displayed in the UI.
- Actions available:
  - View Document
  - Delete Document

----------------------------------------------
7. CYPRESS TEST CASES
----------------------------------------------
The project includes Cypress test cases for:
1. Authentication (Signup & Login)
   - Ensures user can sign up successfully.
   - Validates login functionality.

2. Q&A Functionality
   - Tests that the question is submitted correctly.
   - Checks if the correct answer and document name are displayed.

3. Document Upload & Management
   - Tests file upload.
   - Validates that uploaded files are displayed.
   - Ensures file deletion works properly.

----------------------------------------------
8. RUNNING CYPRESS TESTS
----------------------------------------------
1. Ensure the backend and frontend are running.
2. Open Cypress:
   npx cypress open
3. Click on the test file you want to run (e.g., qna.cy.js).

OR run all tests from the command line:
   npx cypress run

----------------------------------------------
9. API ENDPOINTS (MOCK SERVICE)
----------------------------------------------
#### USER AUTHENTICATION
- **POST /api/signup**  
  - Registers a new user.
  - **Request Body:** `{ "username": "john_doe", "email": "john@example.com", "password": "password123" }`
  - **Response:** `{ "message": "User signed up successfully!" }`

- **POST /api/login**  
  - Authenticates a user.
  - **Request Body:** `{ "email": "john@example.com", "password": "password123" }`
  - **Response:** `{ "message": "Login successful!", "user": { "username": "john_doe", "email": "john@example.com", "role": "User" } }`

#### USER DATA
- **GET /api/users**  
  - Returns all users.

- **GET /api/users/:username**  
  - Fetches a single user.
  - **Response:** `{ "username": "john_doe", "email": "john@example.com", "uploadedDocuments": [] }`

#### DOCUMENT MANAGEMENT
- **POST /upload**  
  - Uploads a document.
  - **Request Body:** FormData `{ file, username }`
  - **Response:** `{ "message": "File uploaded successfully", "document": { "id": 1701234567890, "name": "document.pdf", "url": "http://localhost:3000/uploads/document.pdf" } }`

- **DELETE /api/users/:username/documents/:docId**  
  - Deletes a specific document uploaded by a user.
  - **Response:** `{ "message": "Document deleted successfully", "uploadedDocuments": [] }`

----------------------------------------------
10. TROUBLESHOOTING
----------------------------------------------
- Cypress test failing due to timeout?
  - Increase timeout in cypress.json:
    {
      "defaultCommandTimeout": 10000
    }

- "cy.wait('@getAnswer')" failing?
  - Ensure mock API is loaded properly in cypress/fixtures/answer.json.

- File not found after upload?
  - Check backend/uploads directory.

- Login issue?
  - Ensure correct credentials are used.

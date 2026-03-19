=
        MEDIX PRO: AI-Powered Unified Clinic Notes & Billing System 
==
Project Overview:
-----------------
MEDIX PRO is a modern clinical system that uses AI to parse medical notes
into structured data, prescriptions, and billing. Built using React, 
Golang, and PostgreSQL.

System Requirements:
--------------------
- Node.js (v18 or higher)
- Go (v1.26 or higher)
- PostgreSQL (or Supabase Cloud Account)
- Google Gemini API Key

Project Structure:
------------------
/frontend  - React + Vite + Tailwind CSS
/backend   - Golang + Gin + GORM

==
STEP 1: BACKEND SETUP (Golang)
===========================================================

1. Open your terminal and navigate to the backend folder:
   cd backend

2. Create a file named '.env' in the root of the backend folder.
   Add the following credentials into the .env file:

   PORT=3000
   DATABASE_URL=your_supabase_postgresql_connection_string
   GEMINI_API_KEY=your_google_gemini_api_key

3. Install Go dependencies:
   go mod tidy

4. Start the backend server:
   go run main.go

   (The server will start on http://localhost:3000)

==
STEP 2: FRONTEND SETUP (React)
===========================================================

1. Open a new terminal and navigate to the frontend folder:
   cd frontend

2. Install Node dependencies:
   npm install

3. Start the React development server:
   npm run dev

   (The app will be accessible at http://localhost:5173 or as shown in terminal)

==
STEP 3: DATABASE CONFIGURATION (Supabase)
===========================================================

1. Log in to your Supabase dashboard.
2. Create a new project named 'Clinic'.
3. Go to Project Settings > Database.
4. Copy the "Connection String" (URI) and paste it into the 
   backend .env file's DATABASE_URL.
5. The backend uses GORM Auto-Migration, so it will 
   automatically create the tables (Patients, Consultations, 
   Bills, etc.) on the first run.

==
HOW TO USE THE SYSTEM:
===========================================================

1. Open the Medix Pro web interface in your browser.
2. Go to the 'Workspace' (Consultation) page.
3. Enter the Patient's Name, Age, and Gender.
4. Click the 'Microphone' icon and speak naturally:
   Example: "Patient has a cough. Give Panadol 500mg, cost 200. 
   Do a Blood Test, cost 1500."
5. Click 'Generate Smart Bill'.
6. Review the AI-parsed data on the right. 
7. Use the 'Edit' icons to change prices if needed.
8. Click 'Save PDF' to generate the professional medical invoice.

==
CREDITS:
============
Developed by: Sandaruwan Warnasooriya 20.03.2026 =>
warnasooriyacs2000@gmail.com / +94 76 72 97 190 (whatsapp)

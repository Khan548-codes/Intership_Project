Task Manager Application - Complete Documentation

TABLE OF CONTENTS

1. Project Overview
2. Technology Stack Explanation
3. System Requirements
4. Project Structure
5. Installation Guide
6. Running the Application
7. Using the Application
8. Database Information
9. API Reference
10. Troubleshooting
11. Future Enhancements

==============================================================================
1. PROJECT OVERVIEW
==============================================================================

The Task Manager Application is a full-stack web application designed to help users organize, track, and manage their daily tasks efficiently. It features user authentication, task creation with multiple attributes, filtering capabilities, and persistent data storage using SQLite.

Project Type: Full-Stack Web Application
Duration: Internship Period
Status: Complete and Operational
Platform: Windows/Web-based

Technology Stack:
- Frontend: HTML5, CSS3, JavaScript (Vanilla)
- Backend: Node.js + Express.js
- Database: SQLite3
- Security: bcryptjs for password encryption
- API: RESTful architecture

Key Features:
- User authentication (Register and Login)
- Secure password hashing with bcryptjs
- Task creation with multiple attributes
- Task categorization (Work, Personal, Study)
- Priority levels (Low, Medium, High)
- Due dates and time tracking
- Task search and filtering
- Dark and Light theme support
- Export and Import functionality
- Real-time statistics and progress tracking
- Responsive UI design

==============================================================================
2. TECHNOLOGY STACK EXPLANATION
==============================================================================

Why We Chose Each Technology:

FRONTEND - HTML5, CSS3, Vanilla JavaScript

Why HTML5?
- Native web standard supported by all browsers
- No compilation or build step required
- Perfect for learning web fundamentals
- Semantic markup for better structure and accessibility
- Easy to debug directly in browser

Why CSS3?
- Modern styling without dependencies
- Flexbox and Grid for responsive layouts
- Media queries for mobile adaptation
- CSS variables for theme switching (dark/light mode)
- CSS animations for smooth transitions
- No framework overhead or learning curve

Why Vanilla JavaScript (No Frameworks)?
- Eliminates framework complexity and steep learning curve
- Smaller file size - faster page load
- Direct DOM manipulation without abstraction layers
- Better performance for small to medium applications
- Great for understanding core JavaScript concepts
- No build process needed
- Easy to debug and maintain
- Teaches fundamental web concepts
- Perfect for internship learning experience

When to consider alternatives:
- React: If you need reusable component library or very complex UI
- Vue: For medium complexity with template syntax
- Angular: For enterprise applications with large teams

BACKEND - Node.js + Express.js

Why Node.js?
- Uses JavaScript on both frontend and backend
- Single language across full stack reduces context switching
- Non-blocking I/O - handles multiple requests efficiently
- Very fast for I/O operations and APIs
- Large ecosystem with npm packages
- Easy to scale with built-in clustering
- Perfect for REST APIs and real-time applications
- Active community with excellent documentation

Why Express.js?
- Minimal framework overhead - lightweight and fast
- Simple routing system easy to understand
- Middleware architecture for clean code organization
- Excellent for building REST APIs
- Great for learning backend fundamentals
- No database or ORM locked in - flexibility
- Industry standard with tons of examples
- Easy to extend with custom middleware

Node.js version 14+:
- LTS (Long Term Support) versions prioritize stability
- Version 14 and above include performance improvements
- npm 6+ has excellent package management
- Security patches regularly released

When to consider alternatives:
- Python/Django: For data science or machine learning
- Java/Spring: For large enterprise systems
- Go: For ultra-high performance microservices
- C#/.NET: For Windows-specific applications

DATABASE - SQLite3

Why SQLite?
- Serverless - no separate database server required
- Single file (tasks.db) easy to backup and deploy
- ACID compliant - reliable data integrity
- Lightweight and fast for small to medium datasets
- Perfect for learning database concepts
- No configuration or administration needed
- Works on any platform (Windows, Mac, Linux)
- SQL is industry standard - skills transfer to other databases
- Great for prototyping and development

SQLite limitations and when to upgrade:
- Scales to approximately 1-10 million records comfortably
- Single concurrent write limitation (reads unlimited)
- For 100+ concurrent users: upgrade to PostgreSQL or MySQL
- For distributed systems: use MongoDB or cloud databases
- For real-time: consider Firebase or Realtime Database

When to consider alternatives:
- PostgreSQL: For larger applications (millions of records), advanced features
- MySQL: For web hosting providers, established infrastructure
- MongoDB: For unstructured or document-based data
- Firebase: For quick prototyping, real-time features

SECURITY - bcryptjs

Why bcryptjs?
- Password hashing with automatic salt generation
- Resistant to brute force attacks (intentionally slow)
- 10 salt rounds provides good security/speed balance
- Industry standard for password storage
- Cross-platform compatibility
- No native dependencies - pure JavaScript

Security flow:
1. User enters password on frontend
2. Frontend sends plain password over HTTPS
3. Backend receives password
4. bcryptjs hashes password with salt rounds
5. Only hash stored in database (never plain password)
6. On login, password hashed again and compared to stored hash
7. Passwords never visible in database

When to upgrade:
- JWT tokens for stateless authentication
- OAuth2 for third-party login (Google, GitHub)
- Two-factor authentication (2FA) for higher security
- Session management with secure cookies

ARCHITECTURE FLOW DIAGRAM:

================================================================================

                          USER BROWSER
                    (Frontend Application)
                           |
                           |
                    [login.html]
                    [index.html]
                    [script.js]
                    [style.css]
                           |
                           |
                    API Calls (HTTP)
                           |
            ________________________________________________
            |                                              |
            v                                              v
      [User Auth]                               [Task Operations]
      POST /register                            GET /tasks
      POST /login                               POST /tasks
      GET /profile                              PUT /tasks/:id
            |                                    DELETE /tasks/:id
            |_______________________________________|
                           |
                           v
                    EXPRESS SERVER
                    (backend/server.js)
                           |
              ___________________________
              |                         |
              v                         v
         [CORS Middleware]      [Authentication Routes]
         [JSON Parser]          [Task Routes]
              |
              v
         REQUEST VALIDATION
              |
              v
         BUSINESS LOGIC
         (backend/auth.js)
              |
              v
      ________________________
      |                      |
      v                      v
   HASHING              QUERY BUILDING
   (bcryptjs)           (SQL Preparation)
      |                      |
      |______________________|
              |
              v
    DATABASE FUNCTIONS
    (backend/database.js)
              |
              v
          SQLITE3
          DATABASE
              |
       _______|_______
       |             |
       v             v
   [tasks.db]    [In Memory]
       |             |
       |_____Users___|
       |
       |_____Tasks___|
              |
              v
       Response to Frontend
              |
              v
       JavaScript Updates DOM
              |
              v
       User Sees Changes

================================================================================

DATA FLOW EXAMPLES:

User Registration Flow:
1. User fills form in login.html
2. Script.js validates input (email format, password length)
3. Fetch API sends POST to /api/auth/register with credentials
4. Express routes to auth.js registration handler
5. Auth validates email not already registered
6. bcryptjs hashes password with 10 salt rounds
7. Database.js inserts user into USERS table
8. Response sent back with userId
9. Script.js stores userId in localStorage
10. Browser redirects to main application

Task Creation Flow:
1. User clicks "New Task" button
2. Modal form appears in index.html
3. User fills form and clicks "Create Task"
4. Script.js validates form data
5. Fetch API sends POST to /api/tasks with task details
6. Express routes through middleware and authentication check
7. Task handler calls database.js
8. SQL INSERT query creates new record with user_id
9. Database returns created task with id
10. Script.js adds task to DOM
11. User sees task appear in list immediately

Data Isolation by User:
- When user logs in, userId stored in localStorage
- All API requests include userId in parameters or body
- Backend validates user owns the data being accessed
- SQL queries filter by user_id to prevent data leaks
- Each user can only see/modify their own tasks

SECURITY CONSIDERATIONS:

Frontend Security:
- Never store sensitive data in plain text
- Use localStorage for session tokens only
- Validate all user input before sending
- HTTPS required for production (data encryption in transit)

Backend Security:
- Validate all input from frontend
- Use parameterized SQL queries (prevents SQL injection)
- Hash passwords never store plain text
- Check user_id matches authenticated user
- Rate limiting to prevent brute force attacks
- HTTPS required for production

Database Security:
- Only store hashed passwords
- No sensitive information in plain text
- Backups encrypted in production
- Access logs for audit trail
- Regular backups for disaster recovery

INTEGRATION POINTS:

Frontend to Backend:
- Fetch API (HTTP requests)
- JSON format for data exchange
- Base URL: http://localhost:3000
- Authentication via userId in requests

Backend to Database:
- Node.js sqlite3 package
- SQL queries for data operations
- Automatic connection pooling
- Transaction support for data integrity

Browser Storage:
- localStorage for userId and theme preference
- No passwords stored in browser
- Data cleared on manual logout
- Automatic clear option in future versions

================================================================================

End of Technology Explanation

Next: Review System Requirements section for installation details

==============================================================================
2. SYSTEM REQUIREMENTS
==============================================================================

Hardware Requirements:
- Processor: Intel or AMD processor (any modern version)
- RAM: Minimum 2 GB (4 GB recommended)
- Storage: 500 MB free disk space
- Operating System: Windows 10/11, macOS, or Linux

Software Requirements:
- Node.js: Version 14 or higher (includes npm)
- SQLite: Version 3 (included with SQLite3 npm package)
- Web Browser: Chrome, Firefox, Edge, Safari (any modern browser)
- Text Editor: VS Code recommended (optional)

Third-Party Packages:
- express: 4.18.2 (Web server framework)
- sqlite3: 5.1.6 (Database driver)
- bcryptjs: 2.4.3 (Password encryption)
- cors: 2.8.5 (Cross-origin requests)
- dotenv: 16.0.3 (Environment variables)
- nodemon: 3.0.1 (Auto-restart development)

==============================================================================
4. PROJECT STRUCTURE
==============================================================================


Directory Organization:

D:\Intership\Intership_Project\
+-- backend\
�   +-- server.js                 (Express server entry point)
�   +-- database.js               (SQLite database setup and queries)
�   +-- auth.js                   (Authentication business logic)
�   +-- package.json              (Dependencies configuration)
�   +-- .env                       (Environment variables)
�   +-- .gitignore                (Git exclusion rules)
�   +-- tasks.db                  (SQLite database - auto-created)
�
+-- index.html                     (Main application interface)
+-- login.html                     (Authentication interface)
+-- script.js                      (Frontend application logic)
+-- style.css                      (User interface styling)
+-- README.md                      (This documentation)

Backend File Descriptions:

server.js
- Initializes Express application
- Configures middleware for CORS and JSON parsing
- Establishes API routes for authentication
- Listens on port 3000 by default
- Initializes database on startup

database.js
- Creates SQLite database connection
- Defines table schemas for users and tasks
- Implements database helper functions
- Manages SQL query execution
- Creates tasks.db file on first run

auth.js
- User registration endpoint implementation
- User login endpoint implementation
- Password validation and hashing with bcryptjs
- User profile retrieval functionality
- Email uniqueness verification

Frontend File Descriptions:

login.html
- User registration form with validation
- User login form with authentication
- Form data validation before submission
- API communication with backend
- Session management with localStorage

index.html
- Task list display with filtering
- Task creation modal form
- Sidebar with categories and statistics
- Task management interface
- Search and filter functionality

script.js
- Authentication checking and redirection
- Task CRUD operations (Create, Read, Update, Delete)
- Event listeners for user interactions
- Local storage for session management
- API integration with backend
- Theme management (Dark and Light mode)
- Search and filter implementation

style.css
- Responsive design with Flexbox and Grid
- Dark and Light theme support
- Component styling for all UI elements
- Animation effects for transitions
- Media queries for mobile responsiveness

==============================================================================
5. INSTALLATION GUIDE
==============================================================================


Step 1: Install Node.js

1. Visit https://nodejs.org/
2. Download LTS version (recommended for stability)
3. Execute installer and follow prompts
4. Accept license agreement
5. Keep default installation path
6. Check "Add to PATH" option
7. Complete installation

Verify Installation:
Open PowerShell and run:

node --version
npm --version

Expected output:
v18.16.0 (or similar)
9.6.7 (or similar)

Step 2: Verify Project Location

Ensure project directory exists at:
D:\Intership\Intership_Project\

Step 3: Install Backend Dependencies

1. Open PowerShell
2. Navigate to backend folder:

cd "D:\Intership\Intership_Project\backend"

3. Install dependencies:

npm install

This will:
- Read package.json
- Download all required packages (approximately 30 seconds)
- Create node_modules folder
- Generate package-lock.json

Expected output:
added 222 packages
audited 223 packages
Installation complete

==============================================================================
6. RUNNING THE APPLICATION
==============================================================================


Quick Start (5 Minutes):

Terminal 1 - Start Backend Server:

cd "D:\Intership\Intership_Project\backend"
npm start

Expected output:
Server running at http://localhost:3000
Database: SQLite (tasks.db)
Connected to SQLite database
Users table ready
Tasks table ready

IMPORTANT: Keep this terminal open while using the application

Browser - Open Frontend:

Option A: Direct File (Simplest)
Paste in browser address bar:
file:///D:/Intership/Intership_Project/login.html

Option B: VS Code Live Server
1. Open login.html in VS Code
2. Right-click on file
3. Select "Open with Live Server"
4. Browser opens automatically

Option C: Python HTTP Server
Open a new terminal and run:

cd "D:\Intership\Intership_Project"
python -m http.server 8000

Then open: http://localhost:8000/login.html

Option D: Node HTTP Server
Open a new terminal and run:

cd "D:\Intership\Intership_Project"
npx http-server -p 8080

Then open: http://localhost:8080/login.html

Development Mode:

To run with automatic restart on file changes:

cd "D:\Intership\Intership_Project\backend"
npm run dev

(Requires nodemon to be installed)

==============================================================================
7. USING THE APPLICATION
==============================================================================


First Time Setup:

1. Open login.html in browser
2. Click "Register" tab
3. Create account with:
   - Full Name: (any name)
   - Email: (valid email format)
   - Password: (at least 6 characters)
   - Confirm Password: (must match password)
4. Click "Create Account" button
5. Switch to "Login" tab
6. Enter registered email and password
7. Click "Login" button
8. Task manager interface loads

Creating Tasks:

1. Click "+ New task" button in header
2. Fill in task details:
   - Title: Task name (required)
   - Description: Optional details
   - Category: Work, Personal, or Study
   - Priority: Low, Medium, or High
   - Due Date: Task deadline
   - Due Time: Specific time (optional)
   - Time Estimate: Hours and minutes needed
   - Tags: Custom labels (optional)
   - Reminder: Notification settings
   - Recurring: Repeat pattern (optional)
3. Click "Create Task" button
4. Task appears in task list

Managing Tasks:

View Tasks:
- All tasks display in main content area
- Search bar filters tasks by keyword
- Category filter in sidebar shows specific categories
- Click task card to view full details

Mark Complete:
- Click checkbox on task card
- Task visual changes to completed state
- Statistics update in real time

Delete Tasks:
- Click delete button on task card
- Confirm deletion in modal
- Task removed from list and database

Filter and Search:

Search Functionality:
- Type keyword in search bar
- Results filter in real time
- Searches titles and descriptions

Category Filter:
- Click category in sidebar
- Shows only tasks in that category
- All and Work and Personal and Study options

Statistics:

Dashboard shows:
- Total number of tasks
- Number of completed tasks
- Completion percentage
- Tasks by category

Theme Toggle:

- Click dark mode toggle in sidebar
- Theme preference saves to localStorage
- Persists across browser sessions

==============================================================================
8. DATABASE INFORMATION
==============================================================================


Database Technology:

The application uses SQLite, a lightweight, serverless database that is perfect for development and small to medium-sized applications. SQLite stores data in a single file (tasks.db) and requires no separate server setup.

Advantages:
- Lightweight and fast
- No server required
- Single-file database
- Perfect for learning and prototyping
- Easy to backup and deploy

Database Location:
D:\Intership\Intership_Project\backend\tasks.db

Database Schema:

USERS Table:

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

Column Descriptions:
- id: Unique identifier for each user
- name: User full name
- email: User email address (must be unique)
- password: Hashed password using bcryptjs
- created_at: Account creation timestamp

TASKS Table:

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT DEFAULT 'medium',
  due_date TEXT,
  due_time TEXT,
  completed BOOLEAN DEFAULT 0,
  time_estimate INTEGER,
  tags TEXT,
  reminder TEXT,
  recurring TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

Column Descriptions:
- id: Unique identifier for each task
- user_id: Reference to task owner (links to users table)
- title: Task name or subject (required)
- description: Detailed task information
- category: Task type (Work, Personal, Study)
- priority: Importance level (low, medium, high)
- due_date: Target completion date
- due_time: Target completion time
- completed: Completion status (0 = false, 1 = true)
- time_estimate: Estimated minutes to complete
- tags: Custom labels (comma-separated)
- reminder: Notification timing
- recurring: Repeat pattern information
- created_at: Task creation timestamp

Viewing Database:

Method 1: DB Browser GUI (Recommended)

1. Download from: https://sqlitebrowser.org/
2. Install the application
3. Open DB Browser for SQLite
4. File menu -> Open Database
5. Navigate to: D:\Intership\Intership_Project\backend\tasks.db
6. Click "Browse Data" tab
7. Select table from dropdown (users or tasks)
8. View all data in tabular format

Method 2: Command Line

Open PowerShell in backend folder:

cd "D:\Intership\Intership_Project\backend"
sqlite3 tasks.db

Common SQLite commands:

-- View all users
SELECT * FROM users;

-- View all tasks
SELECT * FROM tasks;

-- View tasks for specific user
SELECT * FROM tasks WHERE user_id = 1;

-- View completed tasks
SELECT * FROM tasks WHERE completed = 1;

-- Count total tasks
SELECT COUNT FROM tasks;

-- Get tasks by category
SELECT category, COUNT FROM tasks GROUP BY category;

-- Exit SQLite
.quit

Method 3: Python Script

If Python is installed, run:

cd "D:\Intership\Intership_Project\backend"
python -c "import sqlite3; conn = sqlite3.connect('tasks.db'); cur = conn.cursor(); print('Users:'); [print(row) for row in cur.execute('SELECT * FROM users')]; print('Tasks:'); [print(row) for row in cur.execute('SELECT * FROM tasks')]"

==============================================================================
9. API REFERENCE
==============================================================================


Base URL:
http://localhost:3000

Authentication Endpoints:

Register New User:
Endpoint: POST /api/auth/register
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
Response (Success - 201):
{
  "message": "User registered successfully",
  "userId": 1,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}

User Login:
Endpoint: POST /api/auth/login
Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}
Response (Success - 200):
{
  "message": "Login successful",
  "userId": 1,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}

Get User Profile:
Endpoint: GET /api/auth/profile/:userId
Response (Success - 200):
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2026-04-14 10:30:00"
}

Server Health Check:
Endpoint: GET /api/health
Response (Success - 200):
{
  "message": "Server is running"
}

Error Responses:

Invalid Email:
Status: 400
{
  "error": "Email already registered"
}

Invalid Password:
Status: 400
{
  "error": "Passwords do not match"
}

Wrong Credentials:
Status: 401
{
  "error": "Invalid email or password"
}

Server Error:
Status: 500
{
  "error": "Registration failed"
}

==============================================================================
10. TROUBLESHOOTING
==============================================================================


Common Issues and Solutions:

Issue: Cannot find module
Solution:
Run npm install in the backend folder:
cd "D:\Intership\Intership_Project\backend"
npm install

Issue: Server won't start or Port 3000 already in use
Solution:
Edit backend and .env file and change:
PORT=3000
to:
PORT=3001

Then update API_URL in script.js to:
http://localhost:3001

Issue: Connection error - Server not running
Solution:
1. Make sure npm start is running in backend terminal
2. Check that terminal displays "Server running at http://localhost:3000"
3. Verify port is not blocked by firewall

Issue: Database errors
Solution:
Delete the database file and restart:
cd "D:\Intership\Intership_Project\backend"
Remove-Item tasks.db
npm start

Warning: This deletes all users and tasks

Issue: CORS errors in browser console
Solution:
Ensure frontend API calls use correct backend URL:
http://localhost:3000

Check that CORS middleware is enabled in server.js

Issue: Login page appears blank
Solution:
1. Verify backend server is running
2. Check browser console for JavaScript errors (F12)
3. Clear browser cache and refresh
4. Try different browser

Issue: Tasks not saving
Solution:
1. Check that backend server is running
2. Verify database is writable (not read-only)
3. Check browser console for errors
4. Try resetting database (see above)

Issue: Cannot register with email
Solution:
Email must be in valid format (example@domain.com)
Email must not already be registered
Password must be at least 6 characters

Issue: npm commands not recognized
Solution:
Node.js may not be installed or not in PATH
Download and reinstall from https://nodejs.org/
Ensure "Add to PATH" is checked during installation
Restart PowerShell after installation

Dependencies Issues:

Clear npm cache:
npm cache clean --force

Reinstall all dependencies:
cd "D:\Intership\Intership_Project\backend"
rm -r node_modules
rm package-lock.json
npm install

==============================================================================
11. FUTURE ENHANCEMENTS
==============================================================================


Planned Features:

Performance Improvements:
- Implement task pagination
- Add caching layer for faster data retrieval
- Optimize database queries
- Minify JavaScript and CSS files

Advanced Features:
- Task editing functionality
- Task history and activity log
- Recurring task automation
- Email notification system
- Task dependencies and subtasks
- Collaborative task sharing
- Real-time synchronization

UI and UX Enhancements:
- Mobile application version
- Progressive Web App (PWA) support
- Advanced calendar views
- Kanban board view
- Drag-and-drop task reordering
- Task templates
- Customizable dashboards

Security Features:
- JWT token-based authentication
- Two-factor authentication (2FA)
- Session timeout
- Password reset functionality
- Rate limiting on API endpoints
- Input sanitization
- SQL injection prevention

Integration Features:
- Google Calendar integration
- Outlook calendar sync
- Slack notifications
- Email reminders
- Cloud storage backup
- API for third-party integrations

Analytics:
- Task completion analytics
- Time tracking reports
- Productivity insights
- Statistics dashboard
- Export to PDF and Excel
- Custom reporting

Database Enhancements:
- Migration to PostgreSQL for larger scale
- Database backup automation
- Data encryption at rest
- Transaction management
- Database replication

Development Tools:
- Automated testing suite
- API documentation (Swagger and OpenAPI)
- Debug logging system
- Performance monitoring
- Error tracking and reporting
- Continuous integration and deployment

Deployment:
- Docker containerization
- Cloud deployment (AWS, Azure, Heroku)
- Domain setup with SSL
- CDN integration
- Load balancing

Documentation:
- Video tutorials
- API documentation
- User manual
- Developer guide
- Architecture documentation

==============================================================================
END OF DOCUMENTATION
==============================================================================

For questions or issues, refer to the troubleshooting section above.

Project Version: 1.0.0
Last Updated: April 19, 2026
Status: Complete and Operational

Multi-User To-Do List Management App
A full-stack To-Do List Application that supports multiple users, powered by Google OAuth Authentication. Users can log in with their Gmail credentials and manage personal and collaborative tasks in real time.
______________
Authentication Features
•	Secure Google OAuth Login (Gmail & Password)
•	Only valid Gmail users can access their personal to-do dashboards
•	Re-authentication is required if credentials do not match
______________
Task Management (CRUD)
Each user can manage their own tasks with full CRUD functionality:
•	Create Task
•	Edit Task
•	Delete Task
•	Update Task Status
______________
Task Attributes
Each task includes:
•	Priority Level: High, Medium, Low
•	Status:
o	In Progress
o	Completed
o	Timed Out
______________
Task Collaboration & Sharing
•	Share tasks with other registered users by their Gmail
•	Collaborated tasks are visible and editable by both users
•	Real-time sync for simultaneous updates
•	Enables team task management
______________
Tech Stack
•	Frontend: React.js
•	Backend: Node.js + Express
•	Authentication: Google OAuth (using Passport.js)
______________
Workflow
1.	User visits the login page
2.	Authenticates via Gmail using Google OAuth
3.	Redirected to personal dashboard with their task list
4.	Can create, update, delete, or collaborate on tasks
5.	Shared tasks appear on both users' dashboards in real time
______________
Preview
Demo Link

______________


This project is a part of a hackathon run by
https://www.katomaran.com


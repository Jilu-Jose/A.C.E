# A.C.E – Academic Control Engine

Live: https://a-c-e.vercel.app/ 

A.C.E (Academic Control Engine) is a web-based Smart Study Planner designed to help students organize academic activities efficiently. It provides structured subject management, task tracking, schedule planning, and user customization features in a clean and interactive interface.

The system is built using HTML, CSS, and JavaScript, with browser localStorage used for persistent data storage.

---

## Project Objective

The objective of A.C.E is to create a centralized academic management platform that enables students to:

- Manage subjects with priority levels
- Track and monitor tasks with deadlines
- Plan daily and weekly schedules
- View productivity insights through a dashboard
- Customize preferences and export data

---

## Features

### 1. Dashboard

The Dashboard provides a quick summary of:

- Total number of subjects
- Total number of tasks
- Number of completed tasks

This helps users track academic progress efficiently.

---

### 2. Subject Management

The Subject Management module allows users to:

- Add new subjects
- Assign priority levels (High, Medium, Low)
- Edit subject details
- Delete subjects
- Persist data using localStorage

Priority levels help users focus on important subjects.

---

### 3. Task Management

The Task Management module allows users to:

- Add tasks with deadlines
- Mark tasks as completed
- Undo completed tasks
- Delete tasks
- Automatically update dashboard statistics

All task data is stored locally to maintain persistence.

---

### 4. Schedule Planner

The Schedule Planner allows users to:

- Add daily or weekly schedule entries
- Set start and end times
- Assign subjects to time slots
- Delete schedule entries

Schedule information is stored using localStorage.

---

### 5. Settings

The Settings module includes:

- Light and Dark theme toggle
- Default subject priority preference
- Data export as JSON file
- Reset stored data

Export functionality enables users to back up academic data.

---

## Technologies Used

- HTML – Structure and layout
- CSS – Styling and responsive design
- JavaScript – Application logic and interactivity
- localStorage – Persistent client-side storage

---

## Data Storage

The following data is stored in localStorage:

- Subjects
- Tasks
- Schedule
- Theme preference
- Default priority preference

This ensures that user data remains available even after refreshing or closing the browser.

---

## Project Structure

A.C.E/
│
├── index.html
├── style.css
├── script.js
└── README.md


---

## How to Run

1. Download or clone the repository.
2. Open `index.html` in any modern web browser.
3. Start managing your academic workflow.

No additional installation or server setup is required.

---

## Future Enhancements

Possible improvements include:

- Schedule conflict detection
- Drag-and-drop timetable interface
- Task filtering and sorting
- Progress analytics visualization
- Cloud-based data storage
- User authentication system

---

## Conclusion

A.C.E – Academic Control Engine provides a structured and efficient academic management system. It demonstrates practical front-end development concepts, dynamic data handling, and persistent storage using JavaScript.

The project promotes better organization, time management, and productivity for students.

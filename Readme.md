# A.C.E – Academic Control Engine

A.C.E (Academic Control Engine) is a powerful web-based productivity system designed to help students organize subjects, manage tasks, plan schedules, track study sessions, and analyze performance — all in one clean and responsive interface.

This project is built using HTML, CSS, and JavaScript, with LocalStorage for data persistence and Chart.js for analytics visualization.

---

## About

A.C.E Study Planner is designed to improve academic productivity through structured planning and performance tracking.

**Live Demo:**  
[https://a-c-e.vercel.app/]

---

## Features

### 1. Dashboard Overview
- Total Subjects counter  
- Total Tasks counter  
- Completed Tasks tracker  
- Study Sessions count  
- Weekly calendar overview  
- Upcoming deadlines section  

---

### 2. Subject Management
- Add subjects with:
  - Priority (High / Medium / Low)
  - Credit hours
- Edit existing subjects
- Delete subjects
- Filter subjects by priority
- Dynamic subject dropdown updates

---

### 3. Task Manager
- Create tasks with:
  - Subject selection
  - Deadline
- Mark tasks as completed or undo
- Delete tasks
- Filter by:
  - All
  - Pending
  - Completed
- Upcoming deadline sorting

---

### 4. Schedule Planner
- Add weekly study schedules
- Set:
  - Day
  - Start time
  - End time
  - Subject
- Automatically grouped by day
- Sorted by time
- Delete schedule entries
- Weekly calendar session count

---

### 5. Pomodoro Timer
- Customizable focus duration
- Customizable break duration
- Start / Pause / Reset controls
- Automatic session tracking
- Daily study session counter
- Total focus time calculation
- Session storage with timestamps

---

### 6. Quick Notes System
- Add categorized notes:
  - General
  - Study
  - Ideas
  - Important
- View note details
- Delete notes
- Category filtering
- Quick access side panel
- Recent notes preview

---

### 7. Analytics & Progress Tracking
- Task completion percentage
- Weekly study goal tracking
- Average daily tasks
- Total study hours
- Productivity score
- Current streak indicator

#### Visual Charts (Chart.js)
- Task distribution (Completed vs Pending)
- Weekly study activity (Line chart)
- Subject-wise task distribution (Bar chart)

---

### 8. Theme Support
- Light mode
- Dark mode
- Theme preference saved in LocalStorage
- Charts dynamically adapt to theme

---

### 9. Data Management
- Export all data as JSON
- Reset all stored data
- Fully LocalStorage based persistence

---

### 10. Responsive Design
- Mobile-friendly layout
- Collapsible sidebar (mobile view)
- Responsive grids
- Optimized for desktop and tablet use

---

## Tech Stack

- HTML5  
- CSS3 (Custom Properties / Variables)  
- Vanilla JavaScript (ES6)  
- Chart.js  
- Lucide Icons  
- LocalStorage API  

---

## Project Structure

/project-folder
│── index.html
│── style.css
│── script.js
│── README.md



---

## Data Storage

All data is stored in the browser using LocalStorage:

- subjects  
- tasks  
- schedule  
- notes  
- pomodoroSessions  
- theme preference  

No backend is required.

---

## How to Run

1. Clone or download the repository.  
2. Open `index.html` in your browser.  
3. Start organizing and tracking your study progress.  

No installation required.

---

## Future Improvements

- Backend integration (Flask / Node.js)
- Email notifications for deadlines
- Push notification support
- User authentication
- Cloud database support
- Progressive Web App support
- Real-time sync
- Enhanced analytics engine

---

## Version

Current Version: 2.0

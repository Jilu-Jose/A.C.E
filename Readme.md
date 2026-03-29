<div align="center">

<br/>

```
    ░█████╗░░█████╗░███████╗
    ██╔══██╗██╔══██╗██╔════╝
    ███████║██║░░╚═╝█████╗░░
    ██╔══██║██║░░██╗██╔══╝░░
    ██║░░██║╚█████╔╝███████╗
    ╚═╝░░╚═╝░╚════╝░╚══════╝
```

# Academic Control Engine

**A web-based student productivity system for subject management, task tracking, schedule planning, Pomodoro sessions, and performance analytics**

<br/>

[![Live Demo](https://img.shields.io/badge/Live_Demo-a--c--e.vercel.app-0A66C2?style=for-the-badge&logo=vercel&logoColor=white)](https://a-c-e-8g4t.vercel.app/login)
[![HTML5](https://img.shields.io/badge/HTML5-Frontend-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-Analytics-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://chartjs.org)
[![Version](https://img.shields.io/badge/Version-2.0-22C55E?style=for-the-badge&logo=semanticversioning&logoColor=white)](https://a-c-e.vercel.app/)

<br/>

</div>

---

## ![overview](https://img.shields.io/badge/-Overview-1a1a2e?style=flat-square&logo=readme&logoColor=white) Overview

**A.C.E** is a fully client-side academic productivity platform built with HTML, CSS, and Vanilla JavaScript. It provides students with a unified workspace to manage subjects and tasks, plan weekly study schedules, track focus sessions with a Pomodoro timer, take categorised notes, and visualise performance through Chart.js analytics — all with zero installation and zero backend dependency.

All data is persisted locally via the browser's LocalStorage API, making A.C.E instantly available on any device without accounts or sign-up.

---

## ![features](https://img.shields.io/badge/-Key_Features-1a1a2e?style=flat-square&logo=todoist&logoColor=white) Key Features

| | Feature | Description |
|---|---|---|
| ![](https://img.shields.io/badge/Dashboard-4285F4?style=flat-square&logo=googlechrome&logoColor=white) | **Dashboard Overview** | Live counters for subjects, tasks, sessions, and upcoming deadlines |
| ![](https://img.shields.io/badge/Subjects-6A0DAD?style=flat-square&logo=bookstack&logoColor=white) | **Subject Management** | Add, edit, and delete subjects with priority levels and credit hours |
| ![](https://img.shields.io/badge/Tasks-0078D4?style=flat-square&logo=microsofttodo&logoColor=white) | **Task Manager** | Create, complete, filter, and deadline-sort tasks by subject |
| ![](https://img.shields.io/badge/Schedule-00979D?style=flat-square&logo=googlecalendar&logoColor=white) | **Schedule Planner** | Weekly study schedule grouped by day and sorted by time |
| ![](https://img.shields.io/badge/Pomodoro-EA4335?style=flat-square&logo=clockify&logoColor=white) | **Pomodoro Timer** | Customisable focus and break durations with session tracking |
| ![](https://img.shields.io/badge/Notes-F59E0B?style=flat-square&logo=notion&logoColor=white) | **Quick Notes** | Categorised notes with filtering, detail view, and recent preview panel |
| ![](https://img.shields.io/badge/Analytics-FF6384?style=flat-square&logo=chartdotjs&logoColor=white) | **Analytics & Tracking** | Productivity score, streaks, study hours, and Chart.js visualisations |
| ![](https://img.shields.io/badge/Dark_Mode-1a1a2e?style=flat-square&logo=halfmoon&logoColor=white) | **Dark / Light Theme** | Theme preference saved in LocalStorage; charts adapt dynamically |

---

## ![modules](https://img.shields.io/badge/-Module_Breakdown-1a1a2e?style=flat-square&logo=buffer&logoColor=white) Module Breakdown

### ![](https://img.shields.io/badge/01-Dashboard-4285F4?style=flat-square&logo=googlechrome&logoColor=white) Dashboard Overview

The central hub providing a real-time snapshot of academic activity.

| Widget | Description |
|---|---|
| Total Subjects | Live count of registered subjects |
| Total Tasks | Aggregate task count across all subjects |
| Completed Tasks | Running tally of marked-complete tasks |
| Study Sessions | Cumulative Pomodoro sessions logged |
| Weekly Calendar | Visual overview of scheduled study blocks |
| Upcoming Deadlines | Sorted list of tasks approaching their due date |

---

### ![](https://img.shields.io/badge/02-Subjects-6A0DAD?style=flat-square&logo=bookstack&logoColor=white) Subject Management

| Capability | Detail |
|---|---|
| Add subject | Name, priority (High / Medium / Low), credit hours |
| Edit subject | Inline editing of all fields |
| Delete subject | Removes subject and cascades to linked tasks |
| Filter by priority | Instant filter across High, Medium, Low |
| Dropdown sync | Task and schedule dropdowns update automatically |

---

### ![](https://img.shields.io/badge/03-Tasks-0078D4?style=flat-square&logo=microsofttodo&logoColor=white) Task Manager

| Capability | Detail |
|---|---|
| Create task | Subject selection, title, deadline date |
| Complete / Undo | Toggle task between pending and completed |
| Delete task | Remove individual task entries |
| Filter | All / Pending / Completed view modes |
| Deadline sort | Upcoming deadlines surfaced automatically |

---

### ![](https://img.shields.io/badge/04-Schedule-00979D?style=flat-square&logo=googlecalendar&logoColor=white) Schedule Planner

| Capability | Detail |
|---|---|
| Add entry | Day, start time, end time, subject |
| Auto-grouping | Entries grouped by day of week |
| Auto-sorting | Entries sorted by start time within each day |
| Delete entry | Remove individual schedule blocks |
| Calendar count | Weekly calendar shows session count per day |

---

### ![](https://img.shields.io/badge/05-Pomodoro-EA4335?style=flat-square&logo=clockify&logoColor=white) Pomodoro Timer

```
┌─────────────────────────────────────────────────┐
│              POMODORO TIMER                     │
│                                                 │
│   Focus Duration     →    Customisable (min)    │
│   Break Duration     →    Customisable (min)    │
│   Controls           →    Start / Pause / Reset │
│   Session Tracking   →    Auto-logged per cycle │
│   Daily Counter      →    Resets at midnight    │
│   Focus Time Total   →    Cumulative hours      │
│   Session Log        →    Stored with timestamp │
└─────────────────────────────────────────────────┘
```

---

### ![](https://img.shields.io/badge/06-Notes-F59E0B?style=flat-square&logo=notion&logoColor=white) Quick Notes System

| Category | Use Case |
|---|---|
| `General` | Miscellaneous notes |
| `Study` | Subject-specific study notes |
| `Ideas` | Brainstorming and concepts |
| `Important` | Priority reminders and key info |

Includes category filtering, detail view modal, a quick-access side panel, and a recent notes preview section.

---

### ![](https://img.shields.io/badge/07-Analytics-FF6384?style=flat-square&logo=chartdotjs&logoColor=white) Analytics & Progress Tracking

**KPI Metrics:**

| Metric | Description |
|---|---|
| Task Completion % | Completed tasks as a percentage of total |
| Weekly Study Goal | Progress towards configured weekly hour target |
| Average Daily Tasks | Mean tasks completed per active day |
| Total Study Hours | Cumulative Pomodoro focus time |
| Productivity Score | Composite score across tasks and sessions |
| Current Streak | Consecutive days with study activity |

**Chart.js Visualisations:**

| Chart | Type | Data |
|---|---|---|
| Task Distribution | Doughnut | Completed vs Pending tasks |
| Weekly Study Activity | Line | Daily session minutes over the week |
| Subject Task Distribution | Bar | Task count per registered subject |

> All charts dynamically re-theme when dark / light mode is toggled.

---

## ![stack](https://img.shields.io/badge/-Tech_Stack-1a1a2e?style=flat-square&logo=stackshare&logoColor=white) Tech Stack

```
┌──────────────┐  ┌───────────────────────────────────────────────────┐
│  STRUCTURE   │  │  HTML5                                            │
├──────────────┤  ├───────────────────────────────────────────────────┤
│  STYLING     │  │  CSS3 · Custom Properties (CSS Variables)         │
├──────────────┤  ├───────────────────────────────────────────────────┤
│  LOGIC       │  │  Vanilla JavaScript (ES6+)                        │
├──────────────┤  ├───────────────────────────────────────────────────┤
│  CHARTS      │  │  Chart.js                                         │
├──────────────┤  ├───────────────────────────────────────────────────┤
│  ICONS       │  │  Lucide Icons                                     │
├──────────────┤  ├───────────────────────────────────────────────────┤
│  PERSISTENCE │  │  Browser LocalStorage API                         │
├──────────────┤  ├───────────────────────────────────────────────────┤
│  DEPLOYMENT  │  │  Vercel                                           │
└──────────────┘  └───────────────────────────────────────────────────┘
```

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-F97316?style=flat-square&logo=lucide&logoColor=white)
![LocalStorage](https://img.shields.io/badge/LocalStorage-API-F7DF1E?style=flat-square&logo=googlechrome&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

---

## ![storage](https://img.shields.io/badge/-Data_Storage-1a1a2e?style=flat-square&logo=googlechrome&logoColor=white) Data Storage

A.C.E requires **no backend, no database, and no installation**. All data is stored entirely in the browser using the LocalStorage API.

| LocalStorage Key | Data Stored |
|---|---|
| `subjects` | Subject list with priority and credit hours |
| `tasks` | Task list with subject links, deadlines, and status |
| `schedule` | Weekly study schedule entries |
| `notes` | Quick notes with categories and timestamps |
| `pomodoroSessions` | Session logs with timestamps and durations |
| `theme` | User's dark / light mode preference |

---

## ![structure](https://img.shields.io/badge/-Project_Structure-1a1a2e?style=flat-square&logo=files&logoColor=white) Project Structure

```
ace/
│
├── index.html        # Application entry point — single-page layout
├── style.css         # Global styles, CSS variables, dark mode, responsive
├── script.js         # All application logic — modules, state, LocalStorage
└── README.md         # Project documentation
```

> A.C.E is intentionally built as a zero-dependency single-page application. No build tools, no package manager, no bundler required.

---

## ![start](https://img.shields.io/badge/-Getting_Started-1a1a2e?style=flat-square&logo=dependabot&logoColor=white) Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/your-username/ace-study-planner.git
cd ace-study-planner
```

**2. Open in browser**
```bash
# Simply open index.html directly
open index.html

# Or serve locally with any static server
npx serve .
python -m http.server 8080
```

**3. Start using A.C.E**

Navigate to `http://localhost:8080` or open `index.html` directly — no installation, no configuration required.

---

## ![future](https://img.shields.io/badge/-Future_Enhancements-1a1a2e?style=flat-square&logo=githubactions&logoColor=white) Future Enhancements

| Enhancement | Description |
|---|---|
| ![](https://img.shields.io/badge/Backend_Integration-grey?style=flat-square&logo=nodedotjs&logoColor=white) | Flask or Node.js backend for cloud persistence |
| ![](https://img.shields.io/badge/User_Auth-grey?style=flat-square&logo=jsonwebtokens&logoColor=white) | Account system for multi-device sync |
| ![](https://img.shields.io/badge/Cloud_Database-grey?style=flat-square&logo=mongodb&logoColor=white) | MongoDB or Firebase for persistent remote storage |
| ![](https://img.shields.io/badge/Email_Notifications-grey?style=flat-square&logo=gmail&logoColor=white) | Deadline reminders sent via email |
| ![](https://img.shields.io/badge/Push_Notifications-grey?style=flat-square&logo=googlechrome&logoColor=white) | Browser push alerts for session and deadline reminders |
| ![](https://img.shields.io/badge/PWA_Support-grey?style=flat-square&logo=googlechrome&logoColor=white) | Progressive Web App — installable and offline-capable |
| ![](https://img.shields.io/badge/Real--Time_Sync-grey?style=flat-square&logo=socketdotio&logoColor=white) | WebSocket-based real-time data sync across devices |
| ![](https://img.shields.io/badge/Enhanced_Analytics-grey?style=flat-square&logo=chartdotjs&logoColor=white) | Deeper insights, custom date ranges, and export to PDF |

---

<div align="center">

Built to help students study smarter, not harder

[![Status](https://img.shields.io/badge/status-live-brightgreen?style=flat-square&logo=vercel&logoColor=white)](https://a-c-e.vercel.app/)
[![Made with JavaScript](https://img.shields.io/badge/Made_with-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Backend Required](https://img.shields.io/badge/No_Backend-LocalStorage_Only-22C55E?style=flat-square&logo=googlechrome&logoColor=white)](https://a-c-e.vercel.app/)
[![Version](https://img.shields.io/badge/Version-2.0-6A0DAD?style=flat-square&logo=semanticversioning&logoColor=white)](https://a-c-e.vercel.app/)

</div>
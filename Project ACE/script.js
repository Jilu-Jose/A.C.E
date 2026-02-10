 lucide.createIcons();
        
   
        let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        let schedule = JSON.parse(localStorage.getItem("schedule")) || [];
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        let pomodoroSessions = JSON.parse(localStorage.getItem("pomodoroSessions")) || [];

      
        let timerInterval = null;
        let timerSeconds = 25 * 60;
        let isTimerRunning = false;
        let isBreak = false;

        
        let taskChart = null;
        let activityChart = null;
        let subjectChart = null;

        
        let currentSubjectFilter = 'all';
        let currentTaskFilter = 'all';
        let currentNoteFilter = 'all';

        function saveData() {
            localStorage.setItem("subjects", JSON.stringify(subjects));
            localStorage.setItem("tasks", JSON.stringify(tasks));
            localStorage.setItem("schedule", JSON.stringify(schedule));
            localStorage.setItem("notes", JSON.stringify(notes));
            localStorage.setItem("pomodoroSessions", JSON.stringify(pomodoroSessions));
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            const themeText = document.getElementById('theme-text');
            themeText.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
            
            
            updateCharts();
            lucide.createIcons();
        }

        function loadTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            const themeText = document.getElementById('theme-text');
            themeText.textContent = savedTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }

        function toggleQuickPanel() {
            const panel = document.getElementById('quickPanel');
            panel.classList.toggle('open');
            if (panel.classList.contains('open')) {
                renderQuickNotes();
            }
        }

        function renderQuickNotes() {
            const container = document.getElementById('quickPanelContent');
            const recentNotes = notes.slice(-5).reverse();
            
            if (recentNotes.length === 0) {
                container.innerHTML = '<div class="empty-state"><div class="empty-text">No notes yet</div></div>';
                return;
            }
            
            container.innerHTML = recentNotes.map(note => `
                <div class="quick-note-item">
                    <div class="quick-note-title">${note.title}</div>
                    <div class="quick-note-text">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</div>
                    <div class="quick-note-date">${note.date} • ${note.category}</div>
                </div>
            `).join('');
        }

        function updateDashboard() {
            document.getElementById('total-subjects').textContent = subjects.length;
            document.getElementById('total-tasks').textContent = tasks.length;
            document.getElementById('completed-tasks').textContent = tasks.filter(t => t.completed).length;
            document.getElementById('study-sessions').textContent = schedule.length;
            
            renderWeeklyCalendar();
            renderUpcomingDeadlines();
            lucide.createIcons();
        }

        function renderWeeklyCalendar() {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const calendarEl = document.getElementById('weekly-calendar');
            calendarEl.innerHTML = '';
            
            days.forEach(day => {
                const daySchedules = schedule.filter(s => s.day.substring(0, 3) === day);
                const dayEl = document.createElement('div');
                dayEl.className = 'calendar-day';
                dayEl.innerHTML = `
                    <div class="day-name">${day}</div>
                    <div class="day-tasks">${daySchedules.length}</div>
                `;
                calendarEl.appendChild(dayEl);
            });
        }

        function renderUpcomingDeadlines() {
            const upcomingEl = document.getElementById('upcoming-deadlines');
            const upcomingTasks = tasks
                .filter(t => !t.completed)
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .slice(0, 5);
            
            if (upcomingTasks.length === 0) {
                upcomingEl.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon"><i data-lucide="check-circle-2"></i></div>
                        <div class="empty-text">No upcoming deadlines!</div>
                    </div>
                `;
                lucide.createIcons();
                return;
            }
            
            upcomingEl.innerHTML = upcomingTasks.map(task => `
                <li class="item">
                    <div class="item-content">
                        <div class="item-title">${task.name}</div>
                        <div class="item-meta">
                            <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
                            Due: ${task.deadline} • ${task.subject || 'No subject'}
                        </div>
                    </div>
                </li>
            `).join('');
            lucide.createIcons();
        }

        function addSubject(event) {
            event.preventDefault();
            
            const name = document.getElementById('subject-name').value;
            const priority = document.getElementById('subject-priority').value;
            const credits = document.getElementById('subject-credits').value || 3;
            
            subjects.push({
                id: Date.now(),
                name,
                priority,
                credits: parseInt(credits)
            });
            
            saveData();
            renderSubjects();
            updateSubjectDropdowns();
            updateCharts();
            
            document.getElementById('subject-name').value = '';
            document.getElementById('subject-credits').value = '';
        }

        function filterSubjects(filter) {
            currentSubjectFilter = filter;
            document.querySelectorAll('#subjects .filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            renderSubjects();
        }

        function renderSubjects() {
            const listEl = document.getElementById('subjects-list');
            
            let filteredSubjects = subjects;
            if (currentSubjectFilter !== 'all') {
                filteredSubjects = subjects.filter(s => s.priority === currentSubjectFilter);
            }
            
            if (filteredSubjects.length === 0) {
                listEl.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon"><i data-lucide="book-open"></i></div>
                        <div class="empty-text">No subjects found</div>
                    </div>
                `;
                lucide.createIcons();
                return;
            }
            
            listEl.innerHTML = filteredSubjects.map((subject) => {
                const index = subjects.findIndex(s => s.id === subject.id);
                return `
                <li class="item">
                    <div class="item-content">
                        <div class="item-title">${subject.name}</div>
                        <div class="item-meta">
                            <span class="priority-badge priority-${subject.priority.toLowerCase()}">
                                ${subject.priority}
                            </span>
                            <span>${subject.credits} credits</span>
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-primary btn-sm" onclick="editSubject(${index})">
                            <i data-lucide="edit"></i>
                            Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteSubject(${index})">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </li>
            `}).join('');
            lucide.createIcons();
        }

        function editSubject(index) {
            const subject = subjects[index];
            const newName = prompt("Edit Subject Name:", subject.name);
            const newPriority = prompt("Edit Priority (High/Medium/Low):", subject.priority);
            
            if (newName) {
                subjects[index].name = newName;
                subjects[index].priority = newPriority || subject.priority;
                saveData();
                renderSubjects();
                updateSubjectDropdowns();
                updateCharts();
            }
        }

        function deleteSubject(index) {
            if (confirm("Are you sure you want to delete this subject?")) {
                subjects.splice(index, 1);
                saveData();
                renderSubjects();
                updateSubjectDropdowns();
                updateCharts();
            }
        }

        function updateSubjectDropdowns() {
            const taskSubjectEl = document.getElementById('task-subject');
            const scheduleSubjectEl = document.getElementById('schedule-subject');
            
            const options = subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
            taskSubjectEl.innerHTML = '<option value="">Select Subject</option>' + options;
            scheduleSubjectEl.innerHTML = '<option value="">Select Subject</option>' + options;
        }

        function filterTasks(filter) {
            currentTaskFilter = filter;
            document.querySelectorAll('#tasks .filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            renderTasks();
        }

        function addTask(event) {
            event.preventDefault();
            
            const name = document.getElementById('task-name').value;
            const subject = document.getElementById('task-subject').value;
            const deadline = document.getElementById('task-deadline').value;
            
            tasks.push({
                id: Date.now(),
                name,
                subject,
                deadline,
                completed: false
            });
            
            saveData();
            renderTasks();
            updateDashboard();
            updateCharts();
            
            document.getElementById('task-name').value = '';
            document.getElementById('task-deadline').value = '';
        }

        function renderTasks() {
            const listEl = document.getElementById('tasks-list');
            
            let filteredTasks = tasks;
            if (currentTaskFilter === 'pending') {
                filteredTasks = tasks.filter(t => !t.completed);
            } else if (currentTaskFilter === 'completed') {
                filteredTasks = tasks.filter(t => t.completed);
            }
            
            if (filteredTasks.length === 0) {
                listEl.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon"><i data-lucide="check-square"></i></div>
                        <div class="empty-text">No tasks found</div>
                    </div>
                `;
                lucide.createIcons();
                return;
            }
            
            listEl.innerHTML = filteredTasks.map((task) => {
                const index = tasks.findIndex(t => t.id === task.id);
                return `
                <li class="item" style="${task.completed ? 'opacity: 0.6;' : ''}">
                    <div class="item-content">
                        <div class="item-title" style="${task.completed ? 'text-decoration: line-through;' : ''}">${task.name}</div>
                        <div class="item-meta">
                            <i data-lucide="book-open" style="width: 14px; height: 14px;"></i>
                            ${task.subject || 'No subject'} •
                            <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
                            ${task.deadline}
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="btn ${task.completed ? 'btn-primary' : 'btn-success'} btn-sm" onclick="toggleTask(${index})">
                            <i data-lucide="${task.completed ? 'rotate-ccw' : 'check'}"></i>
                            ${task.completed ? 'Undo' : 'Done'}
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </li>
            `}).join('');
            lucide.createIcons();
        }

        function toggleTask(index) {
            tasks[index].completed = !tasks[index].completed;
            saveData();
            renderTasks();
            updateDashboard();
            updateAnalytics();
            updateCharts();
        }

        function deleteTask(index) {
            if (confirm("Are you sure you want to delete this task?")) {
                tasks.splice(index, 1);
                saveData();
                renderTasks();
                updateDashboard();
                updateCharts();
            }
        }

        function addSchedule(event) {
            event.preventDefault();
            
            const day = document.getElementById('schedule-day').value;
            const start = document.getElementById('schedule-start').value;
            const end = document.getElementById('schedule-end').value;
            const subject = document.getElementById('schedule-subject').value;
            
            schedule.push({
                id: Date.now(),
                day,
                start,
                end,
                subject
            });
            
            saveData();
            renderSchedule();
            updateDashboard();
            updateCharts();
            
            document.getElementById('schedule-start').value = '';
            document.getElementById('schedule-end').value = '';
        }

        function renderSchedule() {
            const listEl = document.getElementById('schedule-list');
            
            if (schedule.length === 0) {
                listEl.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon"><i data-lucide="calendar"></i></div>
                        <div class="empty-text">No schedules yet. Plan your study time!</div>
                    </div>
                `;
                lucide.createIcons();
                return;
            }
            
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const grouped = {};
            days.forEach(day => {
                grouped[day] = schedule.filter(s => s.day === day).sort((a, b) => a.start.localeCompare(b.start));
            });
            
            let html = '';
            days.forEach(day => {
                if (grouped[day].length > 0) {
                    html += `<h3 style="margin: 20px 0 10px; color: var(--text-secondary); font-size: 14px; text-transform: uppercase; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="calendar-days" style="width: 16px; height: 16px;"></i>
                        ${day}
                    </h3>`;
                    grouped[day].forEach((item) => {
                        const globalIndex = schedule.findIndex(s => s.id === item.id);
                        html += `
                            <li class="item">
                                <div class="item-content">
                                    <div class="item-title">${item.subject || 'Study Time'}</div>
                                    <div class="item-meta">
                                        <i data-lucide="clock" style="width: 14px; height: 14px;"></i>
                                        ${item.start} - ${item.end}
                                    </div>
                                </div>
                                <div class="item-actions">
                                    <button class="btn btn-danger btn-sm" onclick="deleteSchedule(${globalIndex})">
                                        <i data-lucide="trash-2"></i>
                                    </button>
                                </div>
                            </li>
                        `;
                    });
                }
            });
            
            listEl.innerHTML = html;
            lucide.createIcons();
        }

        function deleteSchedule(index) {
            if (confirm("Are you sure you want to delete this schedule?")) {
                schedule.splice(index, 1);
                saveData();
                renderSchedule();
                updateDashboard();
                updateCharts();
            }
        }

        function startTimer() {
            if (isTimerRunning) return;
            
            isTimerRunning = true;
            const statusEl = document.getElementById('timer-status');
            
            timerInterval = setInterval(() => {
                timerSeconds--;
                updateTimerDisplay();
                
                if (timerSeconds <= 0) {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    
                    if (!isBreak) {
                        pomodoroSessions.push({
                            date: new Date().toISOString(),
                            duration: parseInt(document.getElementById('focus-duration').value)
                        });
                        saveData();
                        updatePomodoroStats();
                        updateCharts();
                        alert("Focus session complete! Time for a break.");
                        
                        isBreak = true;
                        statusEl.textContent = 'Break Time';
                        timerSeconds = parseInt(document.getElementById('break-duration').value) * 60;
                        updateTimerDisplay();
                    } else {
                        alert("Break complete! Ready for another focus session?");
                        isBreak = false;
                        statusEl.textContent = 'Focus Session';
                        timerSeconds = parseInt(document.getElementById('focus-duration').value) * 60;
                        updateTimerDisplay();
                    }
                }
            }, 1000);
        }

        function pauseTimer() {
            clearInterval(timerInterval);
            isTimerRunning = false;
        }

        function resetTimer() {
            clearInterval(timerInterval);
            isTimerRunning = false;
            isBreak = false;
            timerSeconds = parseInt(document.getElementById('focus-duration').value) * 60;
            document.getElementById('timer-status').textContent = 'Focus Session';
            updateTimerDisplay();
        }

        function updateTimerDisplay() {
            const minutes = Math.floor(timerSeconds / 60);
            const seconds = timerSeconds % 60;
            document.getElementById('timer-display').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function updatePomodoroStats() {
            const today = new Date().toDateString();
            const todaySessions = pomodoroSessions.filter(s => new Date(s.date).toDateString() === today);
            
            document.getElementById('sessions-today').textContent = todaySessions.length;
            
            const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            document.getElementById('focus-time-today').textContent = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        }

        function filterNotes(filter) {
            currentNoteFilter = filter;
            document.querySelectorAll('#notes .filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            renderNotes();
        }

        function addNote(event) {
            event.preventDefault();
            
            const title = document.getElementById('note-title').value;
            const content = document.getElementById('note-content').value;
            const category = document.getElementById('note-category').value;
            
            notes.push({
                id: Date.now(),
                title,
                content,
                category,
                date: new Date().toLocaleDateString()
            });
            
            saveData();
            renderNotes();
            
            document.getElementById('note-title').value = '';
            document.getElementById('note-content').value = '';
        }

        function renderNotes() {
            const listEl = document.getElementById('notes-list');
            
            let filteredNotes = notes;
            if (currentNoteFilter !== 'all') {
                filteredNotes = notes.filter(n => n.category === currentNoteFilter);
            }
            
            if (filteredNotes.length === 0) {
                listEl.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon"><i data-lucide="sticky-note"></i></div>
                        <div class="empty-text">No notes found</div>
                    </div>
                `;
                lucide.createIcons();
                return;
            }
            
            listEl.innerHTML = filteredNotes.map((note) => {
                const index = notes.findIndex(n => n.id === note.id);
                return `
                <li class="item">
                    <div class="item-content">
                        <div class="item-title">${note.title}</div>
                        <div class="item-meta">
                            <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
                            ${note.date} •
                            <span class="note-tag">${note.category}</span>
                        </div>
                        <div style="margin-top: 8px; font-size: 13px; color: var(--text-secondary);">
                            ${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-primary btn-sm" onclick="viewNote(${index})">
                            <i data-lucide="eye"></i>
                            View
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteNote(${index})">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </li>
            `}).join('');
            lucide.createIcons();
        }

        function viewNote(index) {
            const note = notes[index];
            alert(`${note.title}\n\nCategory: ${note.category}\nDate: ${note.date}\n\n${note.content}`);
        }

        function deleteNote(index) {
            if (confirm("Are you sure you want to delete this note?")) {
                notes.splice(index, 1);
                saveData();
                renderNotes();
            }
        }

        function updateAnalytics() {
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => t.completed).length;
            const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            document.getElementById('task-completion-percent').textContent = taskPercent + '%';
            document.getElementById('task-completion-bar').style.width = taskPercent + '%';
            
            const totalStudyMinutes = pomodoroSessions.reduce((sum, s) => sum + s.duration, 0);
            const studyHours = totalStudyMinutes / 60;
            const goalHours = 35;
            const studyPercent = Math.min(Math.round((studyHours / goalHours) * 100), 100);
            
            document.getElementById('study-goal-percent').textContent = studyPercent + '%';
            document.getElementById('study-goal-bar').style.width = studyPercent + '%';
            
            document.getElementById('avg-daily-tasks').textContent = Math.round(totalTasks / 7);
            document.getElementById('total-study-hours').textContent = Math.round(studyHours) + 'h';
            document.getElementById('current-streak').textContent = completedTasks;
            document.getElementById('productivity-score').textContent = taskPercent + '%';
        }

        function updateCharts() {
            const theme = document.documentElement.getAttribute('data-theme');
            const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
            const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
            
           
            const ctx1 = document.getElementById('taskChart');
            if (ctx1) {
                if (taskChart) taskChart.destroy();
                
                const completedCount = tasks.filter(t => t.completed).length;
                const pendingCount = tasks.filter(t => !t.completed).length;
                
                taskChart = new Chart(ctx1, {
                    type: 'doughnut',
                    data: {
                        labels: ['Completed', 'Pending'],
                        datasets: [{
                            data: [completedCount, pendingCount],
                            backgroundColor: ['#10b981', '#f59e0b'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: textColor }
                            }
                        }
                    }
                });
            }
            
            
            const ctx2 = document.getElementById('activityChart');
            if (ctx2) {
                if (activityChart) activityChart.destroy();
                
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const activityData = days.map(day => {
                    return schedule.filter(s => s.day.substring(0, 3) === day).length;
                });
                
                activityChart = new Chart(ctx2, {
                    type: 'line',
                    data: {
                        labels: days,
                        datasets: [{
                            label: 'Study Sessions',
                            data: activityData,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: textColor }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { color: textColor },
                                grid: { color: gridColor }
                            },
                            x: {
                                ticks: { color: textColor },
                                grid: { color: gridColor }
                            }
                        }
                    }
                });
            }
            
           
            const ctx3 = document.getElementById('subjectChart');
            if (ctx3) {
                if (subjectChart) subjectChart.destroy();
                
                const subjectNames = subjects.map(s => s.name);
                const subjectTaskCounts = subjects.map(s => {
                    return tasks.filter(t => t.subject === s.name).length;
                });
                
                subjectChart = new Chart(ctx3, {
                    type: 'bar',
                    data: {
                        labels: subjectNames,
                        datasets: [{
                            label: 'Tasks per Subject',
                            data: subjectTaskCounts,
                            backgroundColor: '#8b5cf6',
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: textColor }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { color: textColor },
                                grid: { color: gridColor }
                            },
                            x: {
                                ticks: { color: textColor },
                                grid: { color: gridColor }
                            }
                        }
                    }
                });
            }
        }

        function exportData() {
            const data = {
                subjects,
                tasks,
                schedule,
                notes,
                pomodoroSessions,
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "ACE_StudyPlanner_Data.json";
            link.click();
        }

        function resetAllData() {
            if (confirm("Are you sure you want to reset ALL data? This cannot be undone!")) {
                if (confirm("This will delete all subjects, tasks, schedules, and notes. Continue?")) {
                    localStorage.clear();
                    subjects = [];
                    tasks = [];
                    schedule = [];
                    notes = [];
                    pomodoroSessions = [];
                    
                    loadTheme();
                    initApp();
                    
                    alert("All data has been reset!");
                }
            }
        }

        function initApp() {
            loadTheme();
            updateSubjectDropdowns();
            updateDashboard();
            renderSubjects();
            renderTasks();
            renderSchedule();
            renderNotes();
            updateAnalytics();
            updatePomodoroStats();
            updateCharts();
            lucide.createIcons();
        }

    
        document.addEventListener('DOMContentLoaded', () => {
            initApp();
            
          
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const sectionId = this.getAttribute('data-section');
                    
                    
                    document.querySelectorAll('.content-section').forEach(section => {
                        section.classList.remove('active');
                    });
                    
                    
                    document.getElementById(sectionId).classList.add('active');
                    
                 
                    document.querySelectorAll('.nav-link').forEach(l => {
                        l.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                   
                    if (sectionId === 'dashboard') updateDashboard();
                    if (sectionId === 'subjects') renderSubjects();
                    if (sectionId === 'tasks') renderTasks();
                    if (sectionId === 'schedule') renderSchedule();
                    if (sectionId === 'notes') renderNotes();
                    if (sectionId === 'analytics') {
                        updateAnalytics();
                        updateCharts();
                    }
                    
                    lucide.createIcons();
                });
            });
        });
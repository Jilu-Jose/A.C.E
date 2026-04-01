import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
    const { tasks, pomodoroSessions, subjects, schedule } = useData();
    const { theme } = useTheme();

    // Chart colors based on theme
    const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

    // 1. Task Completion Doughnut
    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = tasks.filter(t => !t.completed).length;
    
    const taskData = {
        labels: ['Completed', 'Pending'],
        datasets: [{
            data: [completedCount, pendingCount],
            backgroundColor: ['#22c55e', '#eab308'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    // 2. Weekly Activity Line Chart
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const activityDataCounts = days.map(day => {
        return schedule.filter(s => s.day === day).length;
    });

    const activityData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Study Sessions Scheduled',
            data: activityDataCounts,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.4,
            fill: true
        }]
    };

    // 3. Subject Task Distribution Bar Chart
    const subjectNames = subjects.map(s => s.name);
    const subjectTaskCounts = subjects.map(s => tasks.filter(t => t.subject === s.name).length);

    const subjectData = {
        labels: subjectNames,
        datasets: [{
            label: 'Tasks per Subject',
            data: subjectTaskCounts,
            backgroundColor: '#a855f7',
            borderRadius: 6
        }]
    };

    // 4. Donut: Focus Time Distribution by Subject
    const focusMinutesBySubject = subjects.map(s =>
        pomodoroSessions
            .filter(p => p.subject === s.name)
            .reduce((sum, p) => sum + (Number(p.duration) || 0), 0)
    );

    const focusDistributionData = {
        labels: subjectNames.length ? subjectNames : ['No subjects'],
        datasets: [{
            data: focusMinutesBySubject.some(v => v > 0) ? focusMinutesBySubject : [1],
            backgroundColor: ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#f97316'],
            borderWidth: 0,
            hoverOffset: 5
        }]
    };

    // 5. Weekly focus minutes line
    const focusMinutesByDay = days.map(day =>
        pomodoroSessions
            .filter(s => s.day === day)
            .reduce((sum, s) => sum + (Number(s.duration) || 0), 0)
    );

    const focusTrendData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Focus Minutes',
            data: focusMinutesByDay,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.2)',
            tension: 0.35,
            fill: true
        }]
    };

    // KPI metrics
    const totalTasks = tasks.length;
    const completionRate = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;
    const totalFocusMinutes = pomodoroSessions.reduce((sum, p) => sum + (Number(p.duration) || 0), 0);
    const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);
    const totalScheduleBlocks = schedule.length;

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: textColor } }
        },
        scales: {
            y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true },
            x: { ticks: { color: textColor }, grid: { color: gridColor } }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}
        >
            <div className="card" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                <MetricCard label="Task Completion Rate" value={`${completionRate}%`} color="#22c55e" />
                <MetricCard label="Completed Tasks" value={`${completedCount}`} color="#3b82f6" />
                <MetricCard label="Total Focus Hours" value={`${totalFocusHours}h`} color="#f97316" />
                <MetricCard label="Schedule Blocks" value={`${totalScheduleBlocks}`} color="#a855f7" />
            </div>

            <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Task Completion</h2>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Doughnut data={taskData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: textColor } } } }} />
                </div>
            </div>

            <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Focus Distribution by Subject</h2>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Doughnut data={focusDistributionData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: textColor } } } }} />
                </div>
            </div>

            <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Weekly Study Activity</h2>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Line data={activityData} options={commonOptions} />
                </div>
            </div>

            <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Weekly Focus Trend (Minutes)</h2>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Line data={focusTrendData} options={commonOptions} />
                </div>
            </div>

            <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Subject Task Load</h2>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Bar data={subjectData} options={commonOptions} />
                </div>
            </div>
        </motion.div>
    );
};

const MetricCard = ({ label, value, color }) => (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '0.75rem 0.9rem', borderLeft: `3px solid ${color}` }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</div>
        <div style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.2 }}>{value}</div>
    </div>
);

export default Analytics;

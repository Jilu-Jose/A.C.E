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
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
        >
            <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Task Completion</h2>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Doughnut data={taskData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: textColor } } } }} />
                </div>
            </div>

            <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Weekly Study Activity</h2>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Line data={activityData} options={commonOptions} />
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

export default Analytics;

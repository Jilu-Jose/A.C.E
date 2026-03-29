import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';

const Overview = () => {
    const { subjects, tasks, pomodoroSessions } = useData();

    const stats = [
        { title: 'Total Subjects', value: subjects.length, color: 'var(--primary-color)' },
        { title: 'Pending Tasks', value: tasks.filter(t => !t.completed).length, color: 'var(--warning-color)' },
        { title: 'Completed', value: tasks.filter(t => t.completed).length, color: 'var(--success-color)' },
        { title: 'Study Hours', value: Math.round(pomodoroSessions.reduce((acc, curr) => acc + curr.duration, 0) / 60) + 'h', color: 'var(--purple-color)' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}
            >
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i} 
                        variants={itemVariants}
                        className="card" 
                        style={{ borderLeft: `4px solid ${stat.color}`, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                    >
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.title}</span>
                        <span style={{ fontSize: '2rem', fontWeight: 700 }}>{stat.value}</span>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="card" 
                style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--card-bg)' }}
            >
                {/* For Overview, we will just show a stylized prompt until Analytics tab */}
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Welcome to your Command Center</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>You are doing great! Head to Analytics for deeper insights.</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Overview;

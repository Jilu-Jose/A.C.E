import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Database, Download, Info } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const { subjects, tasks, schedule, pomodoroSessions } = useData();

    const exportData = () => {
        const dataPayload = {
            exportDate: new Date().toISOString(),
            user: user?.name,
            plannerData: {
                subjects,
                tasks,
                schedule,
                pomodoroSessions
            }
        };

        const blob = new Blob([JSON.stringify(dataPayload, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'ACE_Planner_Backup.json';
        link.click();
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Database size={20} color="var(--primary-color)" /> Data Management
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>Export Master Data</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Download a JSON copy of all your planner vectors.</div>
                        </div>
                        <button onClick={exportData} className="btn-primary" style={{ backgroundColor: 'var(--success-color)' }}>
                            <Download size={18} /> Export JSON
                        </button>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Info size={20} color="var(--primary-color)" /> System Information
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong>A.C.E Planner Engine v2.0</strong><br />
                    Powered by the MERN Stack (MongoDB, Express, React, Node.js).<br />
                    AI Integration provided securely via Google Gemini.
                </p>
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(249, 115, 22, 0.1)', borderRadius: '0.5rem', color: 'var(--primary-color)', fontSize: '0.875rem', display: 'inline-block' }}>
                    User ID: {user?._id || 'Offline'}
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;

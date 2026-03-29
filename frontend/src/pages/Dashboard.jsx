import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, Calendar, Timer, BarChart3, Settings as SettingsIcon, Moon, Sun, LogOut, MessageSquare, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Chatbot from '../components/Chatbot';
import Overview from '../components/modules/Overview';
import Subjects from '../components/modules/Subjects';
import Tasks from '../components/modules/Tasks';
import Schedule from '../components/modules/Schedule';
import FocusTimer from '../components/modules/FocusTimer';
import Analytics from '../components/modules/Analytics';
import Settings from '../components/modules/Settings';
import Notes from '../components/modules/Notes';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    
    const [activeSection, setActiveSection] = useState('overview');
    const [showChatbot, setShowChatbot] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const renderModule = () => {
        switch (activeSection) {
            case 'overview': return <Overview key="overview" />;
            case 'subjects': return <Subjects key="subjects" />;
            case 'tasks': return <Tasks key="tasks" />;
            case 'schedule': return <Schedule key="schedule" />;
            case 'timer': return <FocusTimer key="timer" />;
            case 'notes': return <Notes key="notes" />;
            case 'analytics': return <Analytics key="analytics" />;
            case 'settings': return <Settings key="settings" />;
            default: return <Overview key="overview" />;
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-color)' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: 'var(--card-bg)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>A.C.E</span>
                </div>
                
                <div style={{ padding: '1.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.2)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name || 'Student'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Premium Plan</div>
                    </div>
                </div>

                <nav style={{ flex: 1, overflowY: 'auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} />
                    <SidebarItem icon={<BookOpen size={20} />} label="Subjects" active={activeSection === 'subjects'} onClick={() => setActiveSection('subjects')} />
                    <SidebarItem icon={<CheckSquare size={20} />} label="Tasks" active={activeSection === 'tasks'} onClick={() => setActiveSection('tasks')} />
                    <SidebarItem icon={<Calendar size={20} />} label="Schedule" active={activeSection === 'schedule'} onClick={() => setActiveSection('schedule')} />
                    <SidebarItem icon={<Timer size={20} />} label="Focus Timer" active={activeSection === 'timer'} onClick={() => setActiveSection('timer')} />
                    <SidebarItem icon={<StickyNote size={20} />} label="Notes" active={activeSection === 'notes'} onClick={() => setActiveSection('notes')} />
                    <SidebarItem icon={<BarChart3 size={20} />} label="Analytics" active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} />
                    <SidebarItem icon={<SettingsIcon size={20} />} label="Settings" active={activeSection === 'settings'} onClick={() => setActiveSection('settings')} />
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', color: 'var(--text-secondary)', transition: 'all 0.2s', width: '100%', textAlign: 'left' }}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        <span>Toggle Theme</span>
                    </button>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', color: 'var(--danger-color)', transition: 'all 0.2s', width: '100%', textAlign: 'left' }}>
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative' }}>
                <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, textTransform: 'capitalize' }}>{activeSection}</h1>
                </header>
                
                <div style={{ padding: '2rem', flex: 1, position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        {renderModule()}
                    </AnimatePresence>
                </div>

                {/* Floating Chatbot Button */}
                <motion.button
                    onClick={() => setShowChatbot(!showChatbot)}
                    whileHover={{ scale: 1.1, boxShadow: 'var(--shadow-orange)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)', zIndex: 50 }}
                >
                    <MessageSquare size={28} />
                </motion.button>

                {/* Chatbot Interface */}
                {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => {
    return (
        <button 
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: active ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                color: active ? 'var(--primary-color)' : 'var(--text-secondary)',
                fontWeight: active ? 600 : 500,
                transition: 'all 0.2s',
                width: '100%',
                textAlign: 'left'
            }}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

export default Dashboard;

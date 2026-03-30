import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, CheckSquare, Calendar, Timer,
    BarChart3, Settings as SettingsIcon, Moon, Sun, LogOut,
    MessageSquare, StickyNote, Menu, X
} from 'lucide-react';
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

const SECTION_LABELS = {
    overview: 'Overview',
    subjects: 'Subjects',
    tasks: 'Tasks',
    schedule: 'Schedule',
    timer: 'Focus Timer',
    notes: 'Notes',
    analytics: 'Analytics',
    settings: 'Settings',
};

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('overview');
    const [showChatbot, setShowChatbot] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNavClick = (section) => {
        setActiveSection(section);
        if (isMobile) setSidebarOpen(false);
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

    const sidebarContent = (
        <>
            {/* Logo */}
            <div style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary-color), #ff8c42)',
                        color: 'white',
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '1rem',
                        boxShadow: 'var(--shadow-orange)'
                    }}>A</div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>A.C.E</span>
                </div>
                {isMobile && (
                    <button onClick={() => setSidebarOpen(false)} style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}>
                        <X size={22} />
                    </button>
                )}
            </div>

            {/* User Profile */}
            <div style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255,106,0,0.25), rgba(255,140,66,0.15))',
                    border: '2px solid rgba(255,106,0,0.3)',
                    color: 'var(--primary-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '1.1rem', flexShrink: 0
                }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.name || 'Student'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 500, marginTop: '1px' }}>
                        ✦ Premium Plan
                    </div>
                </div>
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <SidebarItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeSection === 'overview'} onClick={() => handleNavClick('overview')} />
                <SidebarItem icon={<BookOpen size={18} />} label="Subjects" active={activeSection === 'subjects'} onClick={() => handleNavClick('subjects')} />
                <SidebarItem icon={<CheckSquare size={18} />} label="Tasks" active={activeSection === 'tasks'} onClick={() => handleNavClick('tasks')} />
                <SidebarItem icon={<Calendar size={18} />} label="Schedule" active={activeSection === 'schedule'} onClick={() => handleNavClick('schedule')} />
                <SidebarItem icon={<Timer size={18} />} label="Focus Timer" active={activeSection === 'timer'} onClick={() => handleNavClick('timer')} />
                <SidebarItem icon={<StickyNote size={18} />} label="Notes" active={activeSection === 'notes'} onClick={() => handleNavClick('notes')} />
                <SidebarItem icon={<BarChart3 size={18} />} label="Analytics" active={activeSection === 'analytics'} onClick={() => handleNavClick('analytics')} />
                <SidebarItem icon={<SettingsIcon size={18} />} label="Settings" active={activeSection === 'settings'} onClick={() => handleNavClick('settings')} />
            </nav>

            {/* Bottom actions */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button
                    onClick={toggleTheme}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.7rem 1rem', borderRadius: '0.5rem',
                        color: 'var(--text-secondary)', transition: 'all 0.2s',
                        width: '100%', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(100,116,139,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    <span>Toggle Theme</span>
                </button>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.7rem 1rem', borderRadius: '0.5rem',
                        color: 'var(--danger-color)', transition: 'all 0.2s',
                        width: '100%', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <LogOut size={18} />
                    <span>Log Out</span>
                </button>
            </div>
        </>
    );

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-color)' }}>

            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside style={{
                    width: '240px',
                    backgroundColor: 'var(--card-bg)',
                    borderRight: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0
                }}>
                    {sidebarContent}
                </aside>
            )}

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobile && sidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSidebarOpen(false)}
                            style={{
                                position: 'fixed', inset: 0,
                                backgroundColor: 'rgba(0,0,0,0.55)',
                                backdropFilter: 'blur(2px)',
                                zIndex: 40
                            }}
                        />
                        {/* Slide-in sidebar */}
                        <motion.aside
                            key="mobile-sidebar"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                            style={{
                                position: 'fixed', top: 0, left: 0, bottom: 0,
                                width: '260px',
                                backgroundColor: 'var(--card-bg)',
                                borderRight: '1px solid var(--border-color)',
                                display: 'flex',
                                flexDirection: 'column',
                                zIndex: 50,
                                boxShadow: '4px 0 24px rgba(0,0,0,0.25)'
                            }}
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative', minWidth: 0 }}>
                {/* Topbar */}
                <header style={{
                    padding: isMobile ? '1rem 1.25rem' : '1.25rem 2rem',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)',
                    position: 'sticky', top: 0, zIndex: 10,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backdropFilter: 'blur(8px)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        {isMobile && (
                            <button
                                id="hamburger-menu-btn"
                                onClick={() => setSidebarOpen(true)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '38px', height: '38px',
                                    borderRadius: '0.5rem',
                                    color: 'var(--text-primary)',
                                    backgroundColor: 'var(--card-bg)',
                                    border: '1px solid var(--border-color)',
                                    flexShrink: 0
                                }}
                            >
                                <Menu size={20} />
                            </button>
                        )}
                        <h1 style={{ fontSize: isMobile ? '1.15rem' : '1.4rem', fontWeight: 700, textTransform: 'capitalize' }}>
                            {SECTION_LABELS[activeSection] || activeSection}
                        </h1>
                    </div>

                    {/* Header right: theme & avatar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                            onClick={toggleTheme}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '36px', height: '36px',
                                borderRadius: '0.5rem',
                                color: 'var(--text-secondary)',
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--border-color)'
                            }}
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary-color), #ff8c42)',
                            color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '700', fontSize: '0.9rem', flexShrink: 0
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div style={{ padding: isMobile ? '1.25rem' : '2rem', flex: 1, position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        {renderModule()}
                    </AnimatePresence>
                </div>

                {/* Floating Chatbot Button */}
                <motion.button
                    id="chatbot-toggle-btn"
                    onClick={() => setShowChatbot(!showChatbot)}
                    whileHover={{ scale: 1.1, boxShadow: 'var(--shadow-orange)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        position: 'fixed',
                        bottom: isMobile ? '1.25rem' : '2rem',
                        right: isMobile ? '1.25rem' : '2rem',
                        width: '56px', height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-color), #ff8c42)',
                        color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-lg)',
                        zIndex: 50
                    }}
                >
                    <MessageSquare size={24} />
                </motion.button>

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
                padding: '0.7rem 1rem',
                borderRadius: '0.625rem',
                backgroundColor: active ? 'rgba(255, 106, 0, 0.12)' : 'transparent',
                color: active ? 'var(--primary-color)' : 'var(--text-secondary)',
                fontWeight: active ? 600 : 500,
                transition: 'all 0.2s',
                width: '100%',
                textAlign: 'left',
                fontSize: '0.875rem',
                borderLeft: active ? '3px solid var(--primary-color)' : '3px solid transparent'
            }}
            onMouseEnter={e => {
                if (!active) e.currentTarget.style.backgroundColor = 'rgba(100,116,139,0.08)';
            }}
            onMouseLeave={e => {
                if (!active) e.currentTarget.style.backgroundColor = 'transparent';
            }}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
    BookOpen, CheckSquare, Clock, TrendingUp, Flame, Target,
    Calendar, StickyNote, Plus, ArrowRight, Zap, Award, Star,
    Activity, CheckCircle2, Circle
} from 'lucide-react';

// ─── motivational quotes pool ───────────────────────────────────────────────
const QUOTES = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
];

// ─── animation variants ───────────────────────────────────────────────────
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 24 } }
};

// ─── helpers ─────────────────────────────────────────────────────────────
const getTodayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
};

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
};

const formatTime = (t) => {
    if (!t) return '';
    const [hh, mm] = t.split(':');
    const h = parseInt(hh);
    return `${h > 12 ? h - 12 : h || 12}:${mm} ${h >= 12 ? 'PM' : 'AM'}`;
};

const getPriorityColor = (deadline) => {
    if (!deadline) return 'var(--text-secondary)';
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff <= 1) return 'var(--danger-color)';
    if (diff <= 3) return 'var(--warning-color)';
    return 'var(--success-color)';
};

// ─── Mini Stat Card ───────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, sub }) => (
    <motion.div
        variants={itemVariants}
        className="card"
        style={{
            borderTop: `3px solid ${color}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}
        whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
    >
        {/* Decorative glow blob */}
        <div style={{
            position: 'absolute', top: '-24px', right: '-24px',
            width: '80px', height: '80px', borderRadius: '50%',
            backgroundColor: color, opacity: 0.07, pointerEvents: 'none'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
            <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                backgroundColor: color + '22', color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {icon}
            </div>
        </div>
        <span style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1, color: 'var(--text-primary)' }}>{value}</span>
        {sub && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sub}</span>}
    </motion.div>
);

// ─── Progress Ring ────────────────────────────────────────────────────────
const ProgressRing = ({ pct, color, size = 80 }) => {
    const radius = (size - 10) / 2;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (pct / 100) * circ;
    return (
        <svg width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border-color)" strokeWidth={8} />
            <circle
                cx={size / 2} cy={size / 2} r={radius} fill="none"
                stroke={color} strokeWidth={8}
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease' }}
            />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
                style={{ fontSize: '1rem', fontWeight: 700, fill: 'var(--text-primary)' }}>
                {pct}%
            </text>
        </svg>
    );
};

// ─── Main Overview ────────────────────────────────────────────────────────
const Overview = () => {
    const { subjects, tasks, pomodoroSessions, schedule, notes } = useData();
    const { user } = useAuth();
    const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // ── derived data ──────────────────────────────────────────────────────
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const studyHours = Math.round(pomodoroSessions.reduce((acc, s) => acc + s.duration, 0) / 60);
    const todaySchedule = schedule
        .filter(s => s.day === getTodayName())
        .sort((a, b) => a.start.localeCompare(b.start));
    const urgentTasks = tasks
        .filter(t => !t.completed)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 4);
    const recentNotes = [...notes].reverse().slice(0, 3);

    // Streak: count consecutive days with pomodoro sessions
    const streak = (() => {
        if (pomodoroSessions.length === 0) return 0;
        const dates = new Set(pomodoroSessions.map(s => s.date?.slice(0, 10)));
        let count = 0;
        const d = new Date();
        while (dates.has(d.toISOString().slice(0, 10))) {
            count++;
            d.setDate(d.getDate() - 1);
        }
        return count;
    })();

    const stats = [
        { label: 'Subjects', value: subjects.length, color: 'var(--primary-color)', icon: <BookOpen size={16} />, sub: 'enrolled' },
        { label: 'Pending Tasks', value: pendingTasks, color: 'var(--warning-color)', icon: <Target size={16} />, sub: `${completedTasks} done` },
        { label: 'Study Hours', value: studyHours + 'h', color: 'var(--purple-color)', icon: <Clock size={16} />, sub: 'total focus time' },
        { label: 'Study Streak', value: streak + '🔥', color: 'var(--danger-color)', icon: <Flame size={16} />, sub: 'consecutive days' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
        >
            {/* ── Hero greeting banner ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                    borderRadius: '1.25rem',
                    padding: '1.75rem 2rem',
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, #ff8c42 50%, #ffb347 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* background decoration */}
                <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'180px', height:'180px', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.08)', pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:'-30px', right:'120px', width:'120px', height:'120px', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />

                <div>
                    <p style={{ fontSize: '0.85rem', opacity: 0.85, fontWeight: 500 }}>{getGreeting()},</p>
                    <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.9rem)', fontWeight: 800, marginTop: '0.2rem' }}>
                        {user?.name || 'Student'} 👋
                    </h2>
                    <p style={{ opacity: 0.9, fontSize: '0.875rem', marginTop: '0.5rem', maxWidth: '340px' }}>
                        You have <strong>{pendingTasks}</strong> task{pendingTasks !== 1 ? 's' : ''} pending and <strong>{todaySchedule.length}</strong> session{todaySchedule.length !== 1 ? 's' : ''} today. Keep crushing it!
                    </p>
                </div>

                {/* Completion ring */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem', flexShrink: 0 }}>
                    <div style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
                        <ProgressRing pct={completionPct} color="white" size={88} />
                    </div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Tasks Done</span>
                </div>
            </motion.div>

            {/* ── Stats grid ── */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1.25rem' }}
            >
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </motion.div>

            {/* ── Middle row: Today's Schedule + Upcoming Tasks ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>

                {/* Today's Schedule */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="card"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={18} color="var(--primary-color)" /> Today — {getTodayName()}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.6rem', borderRadius: '999px' }}>
                            {todaySchedule.length} sessions
                        </span>
                    </div>

                    {todaySchedule.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem 0', fontSize: '0.875rem' }}>
                            <Calendar size={32} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
                            <div>No sessions scheduled today.</div>
                            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Head to Schedule to plan your day!</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {todaySchedule.map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.75rem',
                                        backgroundColor: 'var(--bg-color)',
                                        borderRadius: '0.75rem',
                                        border: '1px solid var(--border-color)'
                                    }}
                                >
                                    <div style={{
                                        width: '4px', height: '36px', borderRadius: '2px',
                                        backgroundColor: 'var(--primary-color)', flexShrink: 0
                                    }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {s.subject}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={12} /> {formatTime(s.start)} – {formatTime(s.end)}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Upcoming / Urgent Tasks */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="card"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Zap size={18} color="var(--warning-color)" /> Upcoming Tasks
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.6rem', borderRadius: '999px' }}>
                            {pendingTasks} pending
                        </span>
                    </div>

                    {urgentTasks.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem 0', fontSize: '0.875rem' }}>
                            <CheckCircle2 size={32} color="var(--success-color)" style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
                            <div>All caught up! 🎉</div>
                            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>No pending tasks found.</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {urgentTasks.map((t, i) => {
                                const pColor = getPriorityColor(t.deadline);
                                const daysLeft = t.deadline ? Math.ceil((new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;
                                return (
                                    <motion.div
                                        key={t.id || i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.75rem',
                                            backgroundColor: 'var(--bg-color)',
                                            borderRadius: '0.75rem',
                                            border: '1px solid var(--border-color)'
                                        }}
                                    >
                                        <Circle size={18} color={pColor} style={{ flexShrink: 0 }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {t.name}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                                {t.subject && <span>{t.subject} · </span>}
                                                {daysLeft !== null && (
                                                    <span style={{ color: pColor, fontWeight: 500 }}>
                                                        {daysLeft <= 0 ? 'Overdue!' : daysLeft === 1 ? 'Due tomorrow' : `${daysLeft}d left`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ── Bottom row: Subject Progress + Recent Notes + Achievements ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>

                {/* Subject Progress */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="card"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={18} color="var(--purple-color)" /> Subject Progress
                    </h3>

                    {subjects.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem 0', fontSize: '0.875rem' }}>
                            <BookOpen size={32} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
                            <div>No subjects added yet.</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {subjects.slice(0, 5).map((sub, i) => {
                                const subTasks = tasks.filter(t => t.subject === sub.name);
                                const subDone = subTasks.filter(t => t.completed).length;
                                const subPct = subTasks.length > 0 ? Math.round((subDone / subTasks.length) * 100) : 0;
                                const colors = ['var(--primary-color)', 'var(--purple-color)', 'var(--success-color)', 'var(--warning-color)', '#06b6d4'];
                                const c = colors[i % colors.length];
                                return (
                                    <div key={sub.id || i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', flexShrink: 0, marginLeft: '0.5rem' }}>{subDone}/{subTasks.length}</span>
                                        </div>
                                        <div style={{ height: '7px', borderRadius: '4px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${subPct}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                                style={{ height: '100%', borderRadius: '4px', backgroundColor: c }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                {/* Recent Notes */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="card"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StickyNote size={18} color="var(--warning-color)" /> Recent Notes
                    </h3>

                    {recentNotes.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem 0', fontSize: '0.875rem' }}>
                            <StickyNote size={32} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
                            <div>No notes yet. Start capturing ideas!</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {recentNotes.map((note, i) => {
                                const noteColors = ['#fef08a', '#bbf7d0', '#bfdbfe'];
                                const nc = noteColors[i % noteColors.length];
                                return (
                                    <div key={note.id || i} style={{
                                        padding: '0.75rem 1rem',
                                        borderRadius: '0.75rem',
                                        backgroundColor: nc + '33',
                                        borderLeft: `3px solid ${nc}`,
                                        border: `1px solid ${nc}55`
                                    }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {note.title || 'Untitled Note'}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {note.content?.slice(0, 60) || 'No content...'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                {/* Achievements / Quick Stats */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="card"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Award size={18} color="var(--success-color)" /> Achievements
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { icon: <Flame size={18} />, label: 'Study Warrior', sub: `${streak} day streak`, unlocked: streak >= 1, color: 'var(--danger-color)' },
                            { icon: <CheckSquare size={18} />, label: 'Task Champion', sub: `${completedTasks} tasks complete`, unlocked: completedTasks >= 1, color: 'var(--success-color)' },
                            { icon: <TrendingUp size={18} />, label: 'Scholar', sub: `${subjects.length} subjects enrolled`, unlocked: subjects.length >= 2, color: 'var(--purple-color)' },
                            { icon: <Star size={18} />, label: 'Note Taker', sub: `${notes.length} notes saved`, unlocked: notes.length >= 3, color: 'var(--warning-color)' },
                        ].map((ach, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.625rem 0.875rem',
                                borderRadius: '0.75rem',
                                backgroundColor: ach.unlocked ? ach.color + '15' : 'var(--bg-color)',
                                border: `1px solid ${ach.unlocked ? ach.color + '40' : 'var(--border-color)'}`,
                                opacity: ach.unlocked ? 1 : 0.45,
                                transition: 'all 0.2s'
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    backgroundColor: ach.unlocked ? ach.color + '25' : 'var(--border-color)',
                                    color: ach.unlocked ? ach.color : 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    {ach.icon}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{ach.label}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{ach.sub}</div>
                                </div>
                                {ach.unlocked && (
                                    <div style={{ marginLeft: 'auto', color: ach.color, fontSize: '0.7rem', fontWeight: 700 }}>✓</div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ── Motivational Quote Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                    borderRadius: '1rem',
                    padding: '1.5rem 2rem',
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(255,106,0,0.08))',
                    border: '1px solid rgba(168,85,247,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    flexWrap: 'wrap'
                }}
            >
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                    background: 'linear-gradient(135deg, #a855f7, #ff6a00)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '1.25rem'
                }}>
                    💡
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <p style={{ fontStyle: 'italic', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>
                        "{quote.text}"
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                        — {quote.author}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Overview;

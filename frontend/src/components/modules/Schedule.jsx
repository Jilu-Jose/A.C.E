import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';

const Schedule = () => {
    const { schedule, subjects, addSchedule, deleteSchedule } = useData();
    const [day, setDay] = useState('Monday');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [subject, setSubject] = useState('');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleAdd = (e) => {
        e.preventDefault();
        if (!start || !end || !subject) return;
        addSchedule({ day, start, end, subject });
        setStart('');
        setEnd('');
        setSubject('');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CalendarIcon size={20} color="var(--primary-color)" /> Add Schedule Timeblock
                </h2>
                <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Day</label>
                        <select value={day} onChange={e => setDay(e.target.value)}>
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Start Time</label>
                        <input type="time" value={start} onChange={e => setStart(e.target.value)} required />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>End Time</label>
                        <input type="time" value={end} onChange={e => setEnd(e.target.value)} required />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Subject</label>
                        <select value={subject} onChange={e => setSubject(e.target.value)} required>
                            <option value="">Select subject...</option>
                            {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '0.75rem' }}>Block Time</button>
                </form>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Weekly Outline</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {days.map(d => {
                        const daySchedules = schedule.filter(s => s.day === d).sort((a,b) => a.start.localeCompare(b.start));
                        if(daySchedules.length === 0) return null;
                        
                        return (
                            <div key={d}>
                                <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                    <CalendarIcon size={16} /> {d}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <AnimatePresence>
                                        {daySchedules.map((s, i) => (
                                            <motion.div 
                                                key={s.id || i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', backgroundColor: 'var(--bg-color)' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{s.subject}</span>
                                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Clock size={14} /> {s.start} - {s.end}
                                                    </span>
                                                </div>
                                                <button onClick={() => deleteSchedule(s.id)} style={{ color: 'var(--danger-color)', padding: '0.25rem' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                    
                    {schedule.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No study blocks scheduled yet. Plan ahead!</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Schedule;

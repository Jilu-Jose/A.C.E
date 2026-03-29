import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { CheckSquare, Trash2, Calendar, BookOpen } from 'lucide-react';

const Tasks = () => {
    const { tasks, subjects, addTask, toggleTask, deleteTask } = useData();
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [deadline, setDeadline] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'

    const handleAdd = (e) => {
        e.preventDefault();
        if (!name.trim() || !deadline) return;
        addTask({ name, subject, deadline });
        setName('');
        setDeadline('');
        setSubject('');
    };

    const filteredTasks = tasks.filter(t => {
        if (filter === 'pending') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    });

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckSquare size={20} color="var(--primary-color)" /> Add New Task
                </h2>
                <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Task Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Read Chapter 5" />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Subject</label>
                        <select value={subject} onChange={e => setSubject(e.target.value)}>
                            <option value="">No Subject</option>
                            {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Deadline</label>
                        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '0.75rem' }}>Add Task</button>
                </form>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>All Tasks</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-color)', padding: '0.25rem', borderRadius: '0.5rem' }}>
                        {['all', 'pending', 'completed'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.25rem',
                                    textTransform: 'capitalize',
                                    backgroundColor: filter === f ? 'var(--primary-color)' : 'transparent',
                                    color: filter === f ? 'white' : 'var(--text-secondary)',
                                    fontWeight: filter === f ? 600 : 400
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No tasks found in this category.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <AnimatePresence mode="popLayout">
                            {filteredTasks.map((t, i) => (
                                <motion.div 
                                    layout
                                    key={t.id || i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    style={{ 
                                        padding: '1rem 1.5rem', 
                                        backgroundColor: t.completed ? 'var(--bg-color)' : 'var(--card-bg)', 
                                        borderRadius: '0.75rem', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        border: '1px solid var(--border-color)',
                                        opacity: t.completed ? 0.6 : 1,
                                        transition: 'background-color 0.3s, opacity 0.3s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <button 
                                            onClick={() => toggleTask(t.id)}
                                            style={{ 
                                                width: '24px', height: '24px', 
                                                borderRadius: '50%', 
                                                border: `2px solid ${t.completed ? 'var(--success-color)' : 'var(--text-secondary)'}`,
                                                backgroundColor: t.completed ? 'var(--success-color)' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white'
                                            }}
                                        >
                                            {t.completed && <CheckSquare size={14} />}
                                        </button>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '1.1rem', textDecoration: t.completed ? 'line-through' : 'none' }}>
                                                {t.name}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                                                {t.subject && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><BookOpen size={14} /> {t.subject}</span>}
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {t.deadline}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteTask(t.id)} style={{ color: 'var(--danger-color)', padding: '0.5rem', borderRadius: '50%' }}>
                                        <Trash2 size={20} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Tasks;

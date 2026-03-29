import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, Edit } from 'lucide-react';

const Subjects = () => {
    const { subjects, addSubject, deleteSubject } = useData();
    const [name, setName] = useState('');
    const [priority, setPriority] = useState('High');
    const [credits, setCredits] = useState('3');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        addSubject({ name, priority, credits: parseInt(credits) || 3 });
        setName('');
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
                    <Plus size={20} color="var(--primary-color)" /> Add New Subject
                </h2>
                <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Subject Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Mathematics" />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Priority</label>
                        <select value={priority} onChange={e => setPriority(e.target.value)}>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Credits</label>
                        <input type="number" value={credits} onChange={e => setCredits(e.target.value)} min="1" />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '0.75rem' }}>Add Subject</button>
                </form>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>My Subjects</h2>
                {subjects.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No subjects added yet.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <AnimatePresence>
                            {subjects.map((sub, i) => (
                                <motion.div 
                                    key={sub.id || i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ type: 'spring', bounce: 0.3 }}
                                    style={{ 
                                        padding: '1rem 1.5rem', 
                                        backgroundColor: 'var(--bg-color)', 
                                        borderRadius: '0.75rem', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        border: '1px solid var(--border-color)'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{sub.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                                            <span style={{ 
                                                color: sub.priority === 'High' ? 'var(--danger-color)' : sub.priority === 'Medium' ? 'var(--warning-color)' : 'var(--success-color)' 
                                            }}>
                                                • {sub.priority} Priority
                                            </span>
                                            <span>{sub.credits} Credits</span>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteSubject(sub.id)} style={{ color: 'var(--danger-color)', padding: '0.5rem', borderRadius: '50%', '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' } }}>
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

export default Subjects;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import BASE_URL from '../../utils/apiBase';
import { StickyNote, Plus, Trash2, X, Eye, BookOpen, Code, Lightbulb, FileText } from 'lucide-react';

const CATEGORIES = [
    { value: 'General', icon: <FileText size={14} />, color: '#64748b' },
    { value: 'Lecture', icon: <BookOpen size={14} />, color: '#3b82f6' },
    { value: 'Idea', icon: <Lightbulb size={14} />, color: '#eab308' },
    { value: 'Code', icon: <Code size={14} />, color: '#a855f7' },
];

const Notes = () => {
    const { notes, setNotes } = useData();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('General');
    const [filter, setFilter] = useState('All');
    const [viewNote, setViewNote] = useState(null);

    const saveNotes = async (updatedNotes) => {
        setNotes(updatedNotes);
        if (!user?.token) return;
        try {
            await axios.post(`${BASE_URL}/api/data`, { notes: updatedNotes }, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` }
            });
        } catch (err) {
            console.error('Failed to save note:', err);
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        const newNote = {
            id: Date.now(),
            title,
            content,
            category,
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        saveNotes([newNote, ...notes]);
        setTitle('');
        setContent('');
        setCategory('General');
    };

    const handleDelete = (id) => {
        saveNotes(notes.filter(n => n.id !== id));
        if (viewNote?.id === id) setViewNote(null);
    };

    const filteredNotes = filter === 'All' ? notes : notes.filter(n => n.category === filter);

    const categoryMeta = (cat) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
            {/* Add Note Form */}
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Plus size={20} color="var(--primary-color)" /> New Note
                </h2>
                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="Note title…"
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}>
                                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Content</label>
                        <textarea
                            rows={5}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            required
                            placeholder="Write your thoughts, key points, or study notes here…"
                            style={{ resize: 'vertical', minHeight: '120px' }}
                        />
                    </div>
                    <div>
                        <button type="submit" className="btn-primary">
                            <StickyNote size={18} /> Save Note
                        </button>
                    </div>
                </form>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['All', ...CATEGORIES.map(c => c.value)].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: '2rem',
                            fontSize: '0.875rem',
                            fontWeight: filter === f ? 600 : 400,
                            backgroundColor: filter === f ? 'var(--primary-color)' : 'var(--card-bg)',
                            color: filter === f ? 'white' : 'var(--text-secondary)',
                            border: `1px solid ${filter === f ? 'var(--primary-color)' : 'var(--border-color)'}`,
                            transition: 'all 0.2s'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Notes Grid */}
            {filteredNotes.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem 2rem' }}>
                    <StickyNote size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p>No notes here yet. Start writing!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <AnimatePresence>
                        {filteredNotes.map(note => {
                            const meta = categoryMeta(note.category);
                            return (
                                <motion.div
                                    key={note.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.88 }}
                                    whileHover={{ y: -4, boxShadow: 'var(--shadow-orange)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    className="card"
                                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', overflow: 'hidden', borderTop: `3px solid ${meta.color}` }}
                                >
                                    {/* Gradient accent strip */}
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${meta.color}, var(--primary-color))` }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, flex: 1, marginRight: '0.5rem' }}>{note.title}</h3>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: meta.color, backgroundColor: `${meta.color}1a`, padding: '0.2rem 0.6rem', borderRadius: '1rem', whiteSpace: 'nowrap' }}>
                                            {meta.icon} {note.category}
                                        </span>
                                    </div>

                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                                        {note.content}
                                    </p>

                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{note.date}</span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => setViewNote(note)} style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                                                <Eye size={14} /> View
                                            </button>
                                            <button onClick={() => handleDelete(note.id)} style={{ color: 'var(--danger-color)', display: 'flex', alignItems: 'center' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Full-screen Note Viewer Modal */}
            <AnimatePresence>
                {viewNote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setViewNote(null)}
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="card"
                            style={{ maxWidth: '680px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: `4px solid ${categoryMeta(viewNote.category).color}` }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{viewNote.title}</h2>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{viewNote.date} · {viewNote.category}</span>
                                </div>
                                <button onClick={() => setViewNote(null)} style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}>
                                    <X size={22} />
                                </button>
                            </div>
                            <div style={{ overflowY: 'auto', flex: 1, lineHeight: 1.8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                                {viewNote.content}
                            </div>
                            <button onClick={() => handleDelete(viewNote.id)} style={{ color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', alignSelf: 'flex-end' }}>
                                <Trash2 size={16} /> Delete Note
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Notes;

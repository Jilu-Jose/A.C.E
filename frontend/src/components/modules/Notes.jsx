import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import {
    StickyNote, Plus, Trash2, X, Eye, BookOpen, Code,
    Lightbulb, FileText, Search, Pin, PinOff, Copy,
    Check, Edit3, Tag, Hash, AlignLeft, Clock, Save,
    ChevronDown, MoreVertical, Star, StarOff
} from 'lucide-react';

// ─── categories ─────────────────────────────────────────────────────────
const CATEGORIES = [
    { value: 'General',  icon: <FileText  size={14} />, color: '#64748b' },
    { value: 'Lecture',  icon: <BookOpen  size={14} />, color: '#3b82f6' },
    { value: 'Idea',     icon: <Lightbulb size={14} />, color: '#eab308' },
    { value: 'Code',     icon: <Code      size={14} />, color: '#a855f7' },
    { value: 'Summary',  icon: <AlignLeft size={14} />, color: '#22c55e' },
    { value: 'Todo',     icon: <Hash      size={14} />, color: '#ef4444' },
];

// ─── colour palette for note cards ──────────────────────────────────────
const NOTE_COLORS = [
    { label: 'Default', value: '' },
    { label: 'Yellow',  value: '#fef9c3' },
    { label: 'Green',   value: '#dcfce7' },
    { label: 'Blue',    value: '#dbeafe' },
    { label: 'Purple',  value: '#ede9fe' },
    { label: 'Rose',    value: '#ffe4e6' },
    { label: 'Peach',   value: '#ffedd5' },
];

const categoryMeta = (cat) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[0];
const countWords  = (str) => str.trim() ? str.trim().split(/\s+/).length : 0;

// ─── Main Notes Component ────────────────────────────────────────────────
const Notes = () => {
    const { notes, saveNotes } = useData();

    // form state
    const [title,    setTitle]    = useState('');
    const [content,  setContent]  = useState('');
    const [category, setCategory] = useState('General');
    const [noteColor, setNoteColor] = useState('');
    const [tags, setTags] = useState('');

    // ui state
    const [filter,    setFilter]    = useState('All');
    const [search,    setSearch]    = useState('');
    const [viewNote,  setViewNote]  = useState(null);
    const [editNote,  setEditNote]  = useState(null);
    const [copied,    setCopied]    = useState(null);
    const [sortBy,    setSortBy]    = useState('newest');    // newest | oldest | pinned | az
    const [showForm,  setShowForm]  = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);     // note id for context menu

    const searchRef = useRef(null);
    const menuRef   = useRef(null);

    // ── close context menu on outside click ──────────────────────────
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setActiveMenu(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── keyboard shortcut: Ctrl+K focuses search ─────────────────────
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    // ── persist to backend (via DataContext) ──────────────────────────
    // saveNotes is provided by DataContext — it updates state AND syncs to MongoDB

    // ── add note ─────────────────────────────────────────────────────
    const handleAdd = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        const newNote = {
            id: Date.now(),
            title: title.trim(),
            content: content.trim(),
            category,
            color: noteColor,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            pinned: false,
            starred: false,
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            updatedAt: Date.now(),
        };
        saveNotes([newNote, ...notes]);
        setTitle(''); setContent(''); setCategory('General'); setNoteColor(''); setTags('');
        setShowForm(false);
    };

    // ── delete ───────────────────────────────────────────────────────
    const handleDelete = (id) => {
        saveNotes(notes.filter(n => n.id !== id));
        if (viewNote?.id === id) setViewNote(null);
        if (editNote?.id  === id) setEditNote(null);
        setActiveMenu(null);
    };

    // ── toggle pin ───────────────────────────────────────────────────
    const togglePin = (id) => {
        saveNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
        setActiveMenu(null);
    };

    // ── toggle star ──────────────────────────────────────────────────
    const toggleStar = (id) => {
        saveNotes(notes.map(n => n.id === id ? { ...n, starred: !n.starred } : n));
        setActiveMenu(null);
    };

    // ── save edited note ─────────────────────────────────────────────
    const handleEditSave = () => {
        if (!editNote) return;
        saveNotes(notes.map(n => n.id === editNote.id
            ? { ...editNote, updatedAt: Date.now(), date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
            : n
        ));
        setEditNote(null);
    };

    // ── copy to clipboard ────────────────────────────────────────────
    const handleCopy = async (note) => {
        const text = `${note.title}\n\n${note.content}`;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(note.id);
            setTimeout(() => setCopied(null), 2000);
        } catch {}
        setActiveMenu(null);
    };

    // ── change note colour ────────────────────────────────────────────
    const changeColor = (id, color) => {
        saveNotes(notes.map(n => n.id === id ? { ...n, color } : n));
        setActiveMenu(null);
    };

    // ── filtering + sorting ───────────────────────────────────────────
    let filtered = notes;
    if (filter !== 'All') filtered = filtered.filter(n => n.category === filter);
    if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(n =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            (n.tags || []).some(t => t.toLowerCase().includes(q))
        );
    }

    switch (sortBy) {
        case 'oldest':  filtered = [...filtered].sort((a, b) => a.id - b.id); break;
        case 'pinned':  filtered = [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)); break;
        case 'az':      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title)); break;
        default:        filtered = [...filtered].sort((a, b) => b.id - a.id);
    }

    const pinnedNotes   = filtered.filter(n => n.pinned);
    const unpinnedNotes = filtered.filter(n => !n.pinned);
    const allOrdered    = sortBy === 'pinned' ? filtered : [...pinnedNotes, ...unpinnedNotes];

    const stats = {
        total: notes.length,
        pinned: notes.filter(n => n.pinned).length,
        starred: notes.filter(n => n.starred).length,
        words: notes.reduce((acc, n) => acc + countWords(n.content), 0),
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── Top Stats Bar ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                {[
                    { label: 'Total Notes', value: stats.total, color: 'var(--primary-color)' },
                    { label: 'Pinned',      value: stats.pinned, color: '#3b82f6' },
                    { label: 'Starred',     value: stats.starred, color: '#eab308' },
                    { label: 'Total Words', value: stats.words, color: 'var(--purple-color)' },
                ].map((s, i) => (
                    <div key={i} className="card" style={{ padding: '1rem', borderTop: `3px solid ${s.color}`, textAlign: 'center' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.value}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Toolbar: search + sort + new button ── */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* search */}
                <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                    <input
                        ref={searchRef}
                        placeholder="Search notes… (Ctrl+K)"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ paddingLeft: '2.5rem', paddingRight: '1rem' }}
                    />
                </div>

                {/* sort */}
                <div style={{ position: 'relative' }}>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ paddingRight: '2rem', appearance: 'none', minWidth: '130px' }}>
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="pinned">Pinned first</option>
                        <option value="az">A – Z</option>
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
                </div>

                {/* new note button */}
                <button onClick={() => setShowForm(v => !v)} className="btn-primary" style={{ whiteSpace: 'nowrap', gap: '0.5rem' }}>
                    <Plus size={18} /> New Note
                </button>
            </div>

            {/* ── Collapsible Add Note Form ── */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="card" style={{ borderTop: '3px solid var(--primary-color)' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <StickyNote size={18} color="var(--primary-color)" /> New Note
                            </h2>
                            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Row 1: title + category + color */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.75rem', alignItems: 'end' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', marginBottom: '0.4rem', display: 'block', fontWeight: 500 }}>Title</label>
                                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Note title" />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', marginBottom: '0.4rem', display: 'block', fontWeight: 500 }}>Category</label>
                                        <select value={category} onChange={e => setCategory(e.target.value)}>
                                            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', marginBottom: '0.4rem', display: 'block', fontWeight: 500 }}>Color</label>
                                        <select value={noteColor} onChange={e => setNoteColor(e.target.value)}>
                                            {NOTE_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 500 }}>Content</label>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{countWords(content)} words · {content.length} chars</span>
                                    </div>
                                    <textarea rows={6} value={content} onChange={e => setContent(e.target.value)} required
                                        placeholder="Write your thoughts, key concepts, or anything worth remembering..."
                                        style={{ resize: 'vertical', minHeight: '120px', fontFamily: 'inherit' }} />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', marginBottom: '0.4rem', display: 'block', fontWeight: 500 }}>
                                        <Tag size={13} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} /> Tags (comma-separated)
                                    </label>
                                    <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="exam, chapter-3, important" />
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button type="submit" className="btn-primary"><Save size={16} /> Save Note</button>
                                    <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Category Filter Pills ── */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['All', ...CATEGORIES.map(c => c.value)].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem',
                        fontWeight: filter === f ? 600 : 400,
                        backgroundColor: filter === f ? 'var(--primary-color)' : 'var(--card-bg)',
                        color: filter === f ? 'white' : 'var(--text-secondary)',
                        border: `1px solid ${filter === f ? 'var(--primary-color)' : 'var(--border-color)'}`,
                        transition: 'all 0.2s'
                    }}>{f}</button>
                ))}
            </div>

            {/* ── Notes Grid ── */}
            {allOrdered.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem 2rem' }}>
                    <StickyNote size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
                    <p style={{ fontWeight: 600 }}>No notes found.</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {search ? 'Try a different search term.' : 'Click "New Note" to get started.'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
                    <AnimatePresence>
                        {allOrdered.map(note => {
                            const meta = categoryMeta(note.category);
                            const bg = note.color || 'var(--card-bg)';
                            return (
                                <motion.div
                                    key={note.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.93 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.88 }}
                                    whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    style={{
                                        backgroundColor: bg,
                                        borderRadius: '1rem',
                                        padding: '1.25rem',
                                        boxShadow: 'var(--shadow-md)',
                                        border: '1px solid var(--border-color)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.75rem',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderTop: note.pinned ? `3px solid #3b82f6` : `3px solid ${meta.color}`
                                    }}
                                >
                                    {/* Pinned badge */}
                                    {note.pinned && (
                                        <div style={{ position: 'absolute', top: '0.6rem', left: '0.75rem', color: '#3b82f6' }}>
                                            <Pin size={14} />
                                        </div>
                                    )}

                                    {/* Header row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: note.pinned ? '1.2rem' : 0 }}>
                                        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3, flex: 1, marginRight: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {note.title}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                            {/* star */}
                                            <button onClick={() => toggleStar(note.id)} title="Star" style={{ color: note.starred ? '#eab308' : 'var(--text-secondary)', padding: '0.2rem' }}>
                                                {note.starred ? <Star size={15} fill="currentColor" /> : <StarOff size={15} />}
                                            </button>
                                            {/* more menu */}
                                            <div style={{ position: 'relative' }} ref={activeMenu === note.id ? menuRef : null}>
                                                <button onClick={() => setActiveMenu(activeMenu === note.id ? null : note.id)} style={{ color: 'var(--text-secondary)', padding: '0.2rem' }}>
                                                    <MoreVertical size={15} />
                                                </button>
                                                <AnimatePresence>
                                                    {activeMenu === note.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9, y: -4 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            style={{
                                                                position: 'absolute', right: 0, top: '1.75rem',
                                                                backgroundColor: 'var(--card-bg)',
                                                                border: '1px solid var(--border-color)',
                                                                borderRadius: '0.75rem',
                                                                boxShadow: 'var(--shadow-lg)',
                                                                zIndex: 200,
                                                                minWidth: '160px',
                                                                overflow: 'hidden',
                                                                padding: '0.25rem'
                                                            }}
                                                        >
                                                            {/* menu items */}
                                                            {[
                                                                { icon: <Eye size={14} />, label: 'View', action: () => { setViewNote(note); setActiveMenu(null); } },
                                                                { icon: <Edit3 size={14} />, label: 'Edit', action: () => { setEditNote({ ...note }); setActiveMenu(null); } },
                                                                { icon: note.pinned ? <PinOff size={14} /> : <Pin size={14} />, label: note.pinned ? 'Unpin' : 'Pin', action: () => togglePin(note.id) },
                                                                { icon: copied === note.id ? <Check size={14} /> : <Copy size={14} />, label: copied === note.id ? 'Copied!' : 'Copy text', action: () => handleCopy(note) },
                                                                { icon: <Trash2 size={14} />, label: 'Delete', action: () => handleDelete(note.id), danger: true },
                                                            ].map((item, i) => (
                                                                <button key={i} onClick={item.action} style={{
                                                                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                                                                    padding: '0.55rem 0.875rem', width: '100%', textAlign: 'left',
                                                                    fontSize: '0.8rem', fontWeight: 500, borderRadius: '0.5rem',
                                                                    color: item.danger ? 'var(--danger-color)' : 'var(--text-primary)',
                                                                    transition: 'background 0.15s'
                                                                }}
                                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = item.danger ? 'rgba(239,68,68,0.08)' : 'var(--bg-color)'}
                                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                >
                                                                    {item.icon} {item.label}
                                                                </button>
                                                            ))}
                                                            {/* color picker row */}
                                                            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.25rem', padding: '0.5rem 0.875rem 0.375rem' }}>
                                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Card color</div>
                                                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                                                    {NOTE_COLORS.map(c => (
                                                                        <button key={c.value} onClick={() => changeColor(note.id, c.value)}
                                                                            title={c.label}
                                                                            style={{
                                                                                width: '18px', height: '18px', borderRadius: '50%',
                                                                                backgroundColor: c.value || 'var(--card-bg)',
                                                                                border: note.color === c.value ? '2px solid var(--primary-color)' : '1px solid var(--border-color)'
                                                                            }} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category badge */}
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: meta.color, backgroundColor: `${meta.color}1a`, padding: '0.2rem 0.6rem', borderRadius: '1rem', alignSelf: 'flex-start' }}>
                                        {meta.icon} {note.category}
                                    </span>

                                    {/* Preview */}
                                    <p onClick={() => setViewNote(note)} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                        {note.content}
                                    </p>

                                    {/* Tags */}
                                    {note.tags && note.tags.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                            {note.tags.slice(0, 4).map((tag, i) => (
                                                <span key={i} style={{ fontSize: '0.68rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-secondary)', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={11} /> {note.date}</span>
                                        <span>{countWords(note.content)} words</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* ── View Modal ── */}
            <AnimatePresence>
                {viewNote && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setViewNote(null)}
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="card"
                            style={{ maxWidth: '700px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: `4px solid ${categoryMeta(viewNote.category).color}`, backgroundColor: viewNote.color || 'var(--card-bg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{viewNote.title}</h2>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        <span>{viewNote.date}</span>
                                        <span>{viewNote.category}</span>
                                        <span>{countWords(viewNote.content)} words</span>
                                    </div>
                                    {viewNote.tags?.length > 0 && (
                                        <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                            {viewNote.tags.map((t, i) => (
                                                <span key={i} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-color)', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>#{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setViewNote(null)} style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}><X size={22} /></button>
                            </div>
                            <div style={{ overflowY: 'auto', flex: 1, lineHeight: 1.85, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontSize: '0.95rem', paddingRight: '0.25rem' }}>
                                {viewNote.content}
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                                <button onClick={() => handleCopy(viewNote)} className="btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                    {copied === viewNote.id ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}
                                </button>
                                <button onClick={() => { setEditNote({ ...viewNote }); setViewNote(null); }} className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                    <Edit3 size={15} /> Edit
                                </button>
                                <button onClick={() => handleDelete(viewNote.id)} style={{ color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Edit Modal ── */}
            <AnimatePresence>
                {editNote && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setEditNote(null)}
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()} className="card"
                            style={{ maxWidth: '700px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '3px solid var(--primary-color)', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Edit3 size={18} color="var(--primary-color)" /> Edit Note
                                </h2>
                                <button onClick={() => setEditNote(null)} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Title</label>
                                <input type="text" value={editNote.title} onChange={e => setEditNote(n => ({ ...n, title: e.target.value }))} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Category</label>
                                    <select value={editNote.category} onChange={e => setEditNote(n => ({ ...n, category: e.target.value }))}>
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Card Color</label>
                                    <select value={editNote.color || ''} onChange={e => setEditNote(n => ({ ...n, color: e.target.value }))}>
                                        {NOTE_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 500 }}>Content</label>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{countWords(editNote.content)} words</span>
                                </div>
                                <textarea rows={8} value={editNote.content} onChange={e => setEditNote(n => ({ ...n, content: e.target.value }))}
                                    style={{ resize: 'vertical', minHeight: '150px', fontFamily: 'inherit' }} />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Tags (comma-separated)</label>
                                <input type="text" value={(editNote.tags || []).join(', ')}
                                    onChange={e => setEditNote(n => ({ ...n, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                                    placeholder="exam, chapter-3, important" />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => setEditNote(null)} className="btn-outline">Cancel</button>
                                <button onClick={handleEditSave} className="btn-primary"><Save size={16} /> Save Changes</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Notes;

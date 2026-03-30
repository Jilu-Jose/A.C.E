import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import {
    StickyNote, Plus, Trash2, X, Eye, BookOpen, Code,
    Lightbulb, FileText, Search, Pin, PinOff, Copy,
    Check, Edit3, Tag, Hash, AlignLeft, Clock, Save,
    ChevronDown, MoreVertical, Star, StarOff, Terminal
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

// ─── Language definitions with IDE themes ──────────────────────────────
const LANGUAGES = [
    {
        id: 'java',
        label: 'Java',
        icon: '☕',
        theme: {
            bg: '#1e1e2e',
            headerBg: '#181825',
            headerText: '#cdd6f4',
            lineNumColor: '#585b70',
            codeBg: '#1e1e2e',
            codeColor: '#cdd6f4',
            accentBar: '#fab387',       // Catppuccin Mocha orange
            tabColor: '#fab387',
            badgeBg: 'rgba(250,179,135,0.18)',
            badgeColor: '#fab387',
            scrollbarColor: '#313244',
        }
    },
    {
        id: 'javascript',
        label: 'JavaScript',
        icon: '⚡',
        theme: {
            bg: '#1c1c1e',
            headerBg: '#111113',
            headerText: '#ffe066',
            lineNumColor: '#4a4a50',
            codeBg: '#1c1c1e',
            codeColor: '#e8e8e8',
            accentBar: '#ffe066',       // JS yellow
            tabColor: '#ffe066',
            badgeBg: 'rgba(255,224,102,0.15)',
            badgeColor: '#ffe066',
            scrollbarColor: '#2e2e30',
        }
    },
    {
        id: 'python',
        label: 'Python',
        icon: '🐍',
        theme: {
            bg: '#1e2127',
            headerBg: '#171a1f',
            headerText: '#61afef',
            lineNumColor: '#4b5263',
            codeBg: '#1e2127',
            codeColor: '#abb2bf',
            accentBar: '#3572a5',       // Python blue
            tabColor: '#61afef',
            badgeBg: 'rgba(97,175,239,0.15)',
            badgeColor: '#61afef',
            scrollbarColor: '#2c313a',
        }
    },
    {
        id: 'cpp',
        label: 'C++',
        icon: '⚙️',
        theme: {
            bg: '#0d1117',
            headerBg: '#010409',
            headerText: '#79c0ff',
            lineNumColor: '#30363d',
            codeBg: '#0d1117',
            codeColor: '#c9d1d9',
            accentBar: '#79c0ff',       // GitHub dark blue
            tabColor: '#79c0ff',
            badgeBg: 'rgba(121,192,255,0.12)',
            badgeColor: '#79c0ff',
            scrollbarColor: '#161b22',
        }
    },
    {
        id: 'bash',
        label: 'Linux',
        icon: '🐧',
        theme: {
            bg: '#0c0c0c',
            headerBg: '#1a1a1a',
            headerText: '#4af626',
            lineNumColor: '#2d4a2d',
            codeBg: '#0c0c0c',
            codeColor: '#4af626',
            accentBar: '#4af626',       // Terminal green
            tabColor: '#4af626',
            badgeBg: 'rgba(74,246,38,0.10)',
            badgeColor: '#4af626',
            scrollbarColor: '#1a1a1a',
        }
    },
    {
        id: 'sql',
        label: 'SQL',
        icon: '🗄️',
        theme: {
            bg: '#1a1625',
            headerBg: '#120f1e',
            headerText: '#bd93f9',
            lineNumColor: '#44395c',
            codeBg: '#1a1625',
            codeColor: '#f8f8f2',
            accentBar: '#bd93f9',       // Dracula purple
            tabColor: '#bd93f9',
            badgeBg: 'rgba(189,147,249,0.15)',
            badgeColor: '#bd93f9',
            scrollbarColor: '#231d38',
        }
    },
];

const categoryMeta = (cat) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[0];
const countWords  = (str) => str.trim() ? str.trim().split(/\s+/).length : 0;
const getLangById = (id) => LANGUAGES.find(l => l.id === id) || null;

const LANG_FILE_EXT = { java: '.java', javascript: '.js', python: '.py', cpp: '.cpp', bash: '.sh', sql: '.sql' };

// ─── IDE Editor (language-themed textarea with line numbers) ─────────────
const IdeEditor = ({ value, onChange, lang, rows = 10, placeholder }) => {
    const t = lang.theme;
    const lines = value.split('\n');
    const lineCount = Math.max(lines.length, rows);
    const textareaRef = useRef(null);

    // Tab key inserts spaces
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const el = e.target;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const newVal = value.substring(0, start) + '    ' + value.substring(end);
            onChange(newVal);
            setTimeout(() => { el.selectionStart = el.selectionEnd = start + 4; }, 0);
        }
    };

    return (
        <div style={{ borderRadius: '0.75rem', overflow: 'hidden', border: `1px solid ${t.accentBar}44`, boxShadow: `0 4px 20px rgba(0,0,0,0.4)` }}>
            {/* IDE chrome */}
            <div style={{ background: t.headerBg, padding: '0.5rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: `1px solid ${t.accentBar}22` }}>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                </div>
                <div style={{ marginLeft: '0.5rem', fontSize: '0.72rem', fontWeight: 600, color: t.tabColor, fontFamily: 'monospace', background: t.codeBg, padding: '0.15rem 0.75rem', borderRadius: '4px 4px 0 0', borderTop: `2px solid ${t.accentBar}` }}>
                    {lang.icon} {lang.label}{LANG_FILE_EXT[lang.id]}
                </div>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: '0.68rem', color: t.lineNumColor, fontFamily: 'monospace' }}>{lines.length} line{lines.length !== 1 ? 's' : ''}</span>
            </div>
            {/* line numbers + textarea */}
            <div style={{ display: 'flex', background: t.codeBg, position: 'relative' }}>
                <div style={{ background: `${t.headerBg}cc`, padding: '0.75rem 0.5rem', minWidth: '2.8rem', textAlign: 'right', userSelect: 'none', fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: '1.7', color: t.lineNumColor, borderRight: `1px solid ${t.lineNumColor}22` }}>
                    {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
                </div>
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || `// Write your ${lang.label} code here...`}
                    spellCheck={false}
                    style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        padding: '0.75rem 1rem', fontFamily: '"JetBrains Mono","Fira Code","Cascadia Code",monospace',
                        fontSize: '0.875rem', lineHeight: '1.7', color: t.codeColor,
                        resize: 'vertical', minHeight: `${Math.max(rows, 8) * 1.7 * 14}px`,
                        caretColor: t.accentBar,
                    }}
                />
            </div>
        </div>
    );
};

// ─── CodeBlock Modal ─────────────────────────────────────────────────────
const CodeBlockModal = ({ code, initialLang, onClose }) => {
    const [selectedLang, setSelectedLang] = useState(initialLang || LANGUAGES[0]);
    const [copied, setCopied] = useState(false);
    const lines = code.split('\n');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    const t = selectedLang.theme;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(6px)',
                zIndex: 300,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1.5rem'
            }}
        >
            <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: '780px',
                    borderRadius: '1.1rem',
                    overflow: 'hidden',
                    boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${t.accentBar}33`,
                    border: `1px solid ${t.accentBar}44`,
                    display: 'flex', flexDirection: 'column',
                    maxHeight: '88vh',
                }}
            >
                {/* ── Language Picker Bar ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    background: '#111',
                    borderBottom: '1px solid #222',
                    flexWrap: 'wrap',
                }}>
                    <Code size={15} color="#888" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.75rem', color: '#666', marginRight: '0.25rem', flexShrink: 0 }}>Format as:</span>
                    {LANGUAGES.map(lang => (
                        <button
                            key={lang.id}
                            onClick={() => setSelectedLang(lang)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.35rem',
                                padding: '0.3rem 0.75rem',
                                borderRadius: '999px',
                                fontSize: '0.78rem', fontWeight: 600,
                                backgroundColor: selectedLang.id === lang.id ? lang.theme.badgeBg : 'transparent',
                                color: selectedLang.id === lang.id ? lang.theme.badgeColor : '#555',
                                border: `1.5px solid ${selectedLang.id === lang.id ? lang.theme.accentBar : '#333'}`,
                                cursor: 'pointer',
                                transition: 'all 0.18s',
                                letterSpacing: '0.01em',
                            }}
                        >
                            <span style={{ fontSize: '0.9em' }}>{lang.icon}</span> {lang.label}
                        </button>
                    ))}
                    <div style={{ flex: 1 }} />
                    <button onClick={onClose} style={{ color: '#555', padding: '0.2rem', flexShrink: 0 }}>
                        <X size={18} />
                    </button>
                </div>

                {/* ── IDE Window Chrome ── */}
                <div style={{ background: t.headerBg, borderBottom: `1px solid ${t.accentBar}33` }}>
                    {/* Traffic lights + tab */}
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0.6rem 1rem 0', gap: '0.4rem' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
                        <div style={{
                            marginLeft: '0.75rem',
                            padding: '0.22rem 1.1rem',
                            borderRadius: '6px 6px 0 0',
                            background: t.codeBg,
                            fontSize: '0.73rem', fontWeight: 600,
                            color: t.tabColor,
                            borderTop: `2px solid ${t.accentBar}`,
                            fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
                        }}>
                            {selectedLang.icon} {
                                selectedLang.id === 'java' ? 'Main.java' :
                                selectedLang.id === 'javascript' ? 'script.js' :
                                selectedLang.id === 'python' ? 'main.py' :
                                selectedLang.id === 'cpp' ? 'main.cpp' :
                                selectedLang.id === 'bash' ? 'terminal.sh' :
                                'query.sql'
                            }
                        </div>
                    </div>
                </div>

                {/* ── Code Display ── */}
                <div style={{
                    background: t.codeBg,
                    overflowY: 'auto',
                    flex: 1,
                    position: 'relative',
                }}>
                    {/* Left accent strip */}
                    <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: '3px',
                        background: `linear-gradient(180deg, ${t.accentBar}, ${t.accentBar}66)`,
                    }} />

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"JetBrains Mono","Fira Code","Cascadia Code","Courier New",monospace', fontSize: '0.875rem' }}>
                        <tbody>
                            {lines.map((line, idx) => (
                                <tr key={idx} style={{ lineHeight: 1.7 }}>
                                    <td style={{
                                        textAlign: 'right',
                                        paddingRight: '1rem',
                                        paddingLeft: '1rem',
                                        userSelect: 'none',
                                        color: t.lineNumColor,
                                        fontSize: '0.78rem',
                                        minWidth: '2.5rem',
                                        verticalAlign: 'top',
                                        borderRight: `1px solid ${t.lineNumColor}33`,
                                    }}>
                                        {idx + 1}
                                    </td>
                                    <td style={{
                                        padding: '0 1.25rem 0 1rem',
                                        color: t.codeColor,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        verticalAlign: 'top',
                                    }}>
                                        {line || ' '}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Footer ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.6rem 1rem',
                    background: t.headerBg,
                    borderTop: `1px solid ${t.accentBar}22`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            fontSize: '0.72rem', fontWeight: 600,
                            padding: '0.2rem 0.65rem', borderRadius: '999px',
                            backgroundColor: t.badgeBg,
                            color: t.badgeColor,
                            border: `1px solid ${t.accentBar}44`,
                            fontFamily: 'monospace',
                        }}>
                            {selectedLang.icon} {selectedLang.label}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#444' }}>
                            {lines.length} line{lines.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleCopy}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.4rem 1rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.8rem', fontWeight: 600,
                            backgroundColor: copied ? '#1a4a1a' : t.badgeBg,
                            color: copied ? '#4af626' : t.badgeColor,
                            border: `1.5px solid ${copied ? '#4af626' : t.accentBar}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit',
                        }}
                    >
                        {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Code</>}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Selection Language Picker Popup ────────────────────────────────────
const SelectionPicker = ({ position, onSelect, onDismiss }) => {
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onDismiss();
        };
        setTimeout(() => document.addEventListener('mousedown', handler), 0);
        return () => document.removeEventListener('mousedown', handler);
    }, [onDismiss]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            style={{
                position: 'fixed',
                left: Math.min(position.x, window.innerWidth - 380),
                top: position.y + 10,
                zIndex: 400,
                backgroundColor: '#18181b',
                border: '1px solid #333',
                borderRadius: '0.85rem',
                boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
                padding: '0.6rem 0.75rem',
                display: 'flex', flexDirection: 'column', gap: '0.45rem',
                minWidth: '210px',
            }}
        >
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.7rem', color: '#555', paddingBottom: '0.35rem',
                borderBottom: '1px solid #2a2a2a', marginBottom: '0.1rem',
            }}>
                <Code size={12} /> Format selected as code
            </div>
            {LANGUAGES.map(lang => (
                <button
                    key={lang.id}
                    onMouseDown={e => { e.preventDefault(); onSelect(lang); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                        padding: '0.45rem 0.6rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.82rem', fontWeight: 500,
                        color: lang.theme.badgeColor,
                        textAlign: 'left', cursor: 'pointer',
                        transition: 'background 0.15s',
                        background: 'transparent',
                        border: 'none',
                        width: '100%',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = lang.theme.badgeBg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <span style={{ fontSize: '1em' }}>{lang.icon}</span>
                    <span>{lang.label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#444', fontFamily: 'monospace' }}>
                        {lang.id === 'java' ? '.java' :
                         lang.id === 'javascript' ? '.js' :
                         lang.id === 'python' ? '.py' :
                         lang.id === 'cpp' ? '.cpp' :
                         lang.id === 'bash' ? '.sh' : '.sql'}
                    </span>
                </button>
            ))}
        </motion.div>
    );
};

// ─── Hook: detect text selection inside a ref'd element ─────────────────
const useTextSelection = (onSelection) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseUp = (e) => {
            setTimeout(() => {
                const selection = window.getSelection();
                if (!selection || selection.isCollapsed) return;
                const selectedText = selection.toString().trim();
                if (!selectedText || selectedText.length < 2) return;

                // Check if selection is inside our container
                const range = selection.getRangeAt(0);
                if (containerRef.current && !containerRef.current.contains(range.commonAncestorContainer)) return;

                const rect = range.getBoundingClientRect();
                onSelection({
                    text: selectedText,
                    position: { x: rect.left, y: rect.bottom },
                });
            }, 10);
        };

        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [onSelection]);

    return containerRef;
};

// ─── Main Notes Component ────────────────────────────────────────────────
const Notes = () => {
    const { notes, saveNotes } = useData();

    // form state
    const [title,    setTitle]    = useState('');
    const [content,  setContent]  = useState('');
    const [category, setCategory] = useState('General');
    const [noteColor, setNoteColor] = useState('');
    const [tags, setTags] = useState('');
    const [codeLang, setCodeLang] = useState(''); // '' = plain text, else language id

    // ui state
    const [filter,    setFilter]    = useState('All');
    const [search,    setSearch]    = useState('');
    const [viewNote,  setViewNote]  = useState(null);
    const [editNote,  setEditNote]  = useState(null);
    const [copied,    setCopied]    = useState(null);
    const [sortBy,    setSortBy]    = useState('newest');
    const [showForm,  setShowForm]  = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    // code block feature state
    const [selectionInfo,  setSelectionInfo]  = useState(null); // { text, position }
    const [codeBlockCode,  setCodeBlockCode]  = useState(null); // triggers modal

    const searchRef = useRef(null);
    const menuRef   = useRef(null);

    // ── Handle text selection ────────────────────────────────────────
    const handleSelection = useCallback((info) => {
        setSelectionInfo(info);
    }, []);

    const handleLangSelect = (lang) => {
        setCodeBlockCode({ code: selectionInfo.text, lang });
        setSelectionInfo(null);
        window.getSelection()?.removeAllRanges();
    };

    const dismissPicker = useCallback(() => {
        setSelectionInfo(null);
    }, []);

    // ── Selection-aware content ref (for view modal & cards) ─────────
    const selectionRef = useTextSelection(handleSelection);

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
            codeLang: codeLang || '',
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            pinned: false,
            starred: false,
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            updatedAt: Date.now(),
        };
        saveNotes([newNote, ...notes]);
        setTitle(''); setContent(''); setCategory('General'); setNoteColor(''); setTags(''); setCodeLang('');
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

            {/* ── Code Feature Hint ── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.6rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(168,85,247,0.07)',
                border: '1px dashed rgba(168,85,247,0.3)',
                fontSize: '0.78rem', color: 'var(--text-secondary)',
            }}>
                <Code size={14} color="#a855f7" style={{ flexShrink: 0 }} />
                <span><strong style={{ color: '#a855f7' }}>Tip:</strong> Select any text inside a note to instantly format it as a syntax-highlighted code block (Java, JS, Python, C++, Linux, SQL).</span>
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

                                {/* Code Language Picker */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                                        <Code size={13} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} /> Code Language <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(optional)</span>
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        <button type="button" onClick={() => setCodeLang('')}
                                            style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: codeLang === '' ? 600 : 400,
                                                backgroundColor: codeLang === '' ? 'var(--primary-color)' : 'var(--card-bg)',
                                                color: codeLang === '' ? '#fff' : 'var(--text-secondary)',
                                                border: `1.5px solid ${codeLang === '' ? 'var(--primary-color)' : 'var(--border-color)'}`, cursor: 'pointer' }}>
                                            📝 Plain Text
                                        </button>
                                        {LANGUAGES.map(lang => (
                                            <button key={lang.id} type="button" onClick={() => setCodeLang(lang.id)}
                                                style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: codeLang === lang.id ? 600 : 400,
                                                    backgroundColor: codeLang === lang.id ? lang.theme.badgeBg : 'var(--card-bg)',
                                                    color: codeLang === lang.id ? lang.theme.badgeColor : 'var(--text-secondary)',
                                                    border: `1.5px solid ${codeLang === lang.id ? lang.theme.accentBar : 'var(--border-color)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                                                {lang.icon} {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 500 }}>Content</label>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{countWords(content)} words · {content.length} chars</span>
                                    </div>
                                    {codeLang ? (
                                        <IdeEditor value={content} onChange={setContent} lang={getLangById(codeLang)} rows={8} />
                                    ) : (
                                        <textarea rows={6} value={content} onChange={e => setContent(e.target.value)} required
                                            placeholder="Write your thoughts, key concepts, or anything worth remembering..."
                                            style={{ resize: 'vertical', minHeight: '120px', fontFamily: 'inherit' }} />
                                    )}
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
                <div
                    ref={selectionRef}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}
                >
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

                            {/* Content: IDE block or plain text */}
                            {viewNote.codeLang ? (
                                (() => {
                                    const lang = getLangById(viewNote.codeLang);
                                    const t = lang.theme;
                                    const lines = viewNote.content.split('\n');
                                    return (
                                        <div style={{ flex: 1, overflowY: 'auto', borderRadius: '0.75rem', overflow: 'hidden', border: `1px solid ${t.accentBar}44`, boxShadow: `0 4px 20px rgba(0,0,0,0.35)` }}>
                                            <div style={{ background: t.headerBg, padding: '0.45rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: `1px solid ${t.accentBar}22` }}>
                                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                                                </div>
                                                <div style={{ marginLeft: '0.5rem', fontSize: '0.72rem', fontWeight: 600, color: t.tabColor, fontFamily: 'monospace', background: t.codeBg, padding: '0.15rem 0.75rem', borderRadius: '4px', borderTop: `2px solid ${t.accentBar}` }}>
                                                    {lang.icon} {lang.label}{LANG_FILE_EXT[lang.id]}
                                                </div>
                                                <div style={{ flex: 1 }} />
                                                <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.6rem', borderRadius: '999px', backgroundColor: t.badgeBg, color: t.badgeColor, fontFamily: 'monospace' }}>{lang.label}</span>
                                            </div>
                                            <div style={{ display: 'flex', background: t.codeBg, overflowY: 'auto', maxHeight: '340px' }}>
                                                <div style={{ background: `${t.headerBg}cc`, padding: '0.75rem 0.5rem', minWidth: '2.8rem', textAlign: 'right', userSelect: 'none', fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: '1.7', color: t.lineNumColor, borderRight: `1px solid ${t.lineNumColor}22` }}>
                                                    {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
                                                </div>
                                                <pre style={{ flex: 1, margin: 0, padding: '0.75rem 1rem', fontFamily: '"JetBrains Mono","Fira Code","Cascadia Code",monospace', fontSize: '0.875rem', lineHeight: '1.7', color: t.codeColor, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{viewNote.content}</pre>
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : (
                                <div ref={selectionRef} style={{ overflowY: 'auto', flex: 1, lineHeight: 1.85, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontSize: '0.95rem', paddingRight: '0.25rem', userSelect: 'text', cursor: 'text' }}>
                                    {viewNote.content}
                                </div>
                            )}

                            {/* Selection hint (only in plain text mode) */}
                            {!viewNote.codeLang && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', opacity: 0.7 }}>
                                    <Code size={11} /> Select text above to format as code
                                </div>
                            )}

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

            {/* ── Selection Language Picker ── */}
            <AnimatePresence>
                {selectionInfo && (
                    <SelectionPicker
                        position={selectionInfo.position}
                        onSelect={handleLangSelect}
                        onDismiss={dismissPicker}
                    />
                )}
            </AnimatePresence>

            {/* ── Code Block Modal ── */}
            <AnimatePresence>
                {codeBlockCode && (
                    <CodeBlockModal
                        code={codeBlockCode.code}
                        initialLang={codeBlockCode.lang}
                        onClose={() => setCodeBlockCode(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Notes;

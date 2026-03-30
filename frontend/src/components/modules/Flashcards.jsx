import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import BASE_URL from '../../utils/apiBase';
import {
    Layers, Plus, Trash2, X, ChevronLeft, ChevronRight,
    RotateCcw, Check, BookOpen, Save, Shuffle, Eye,
    EyeOff, Edit3
} from 'lucide-react';

// ─── Flip Card ───────────────────────────────────────────────────────────
const FlipCard = ({ front, back, flipped, onFlip, color }) => {
    const cardColors = {
        orange: '#ff6a00', blue: '#3b82f6', green: '#22c55e',
        purple: '#a855f7', rose: '#f43f5e', cyan: '#06b6d4'
    };
    const accent = cardColors[color] || cardColors.orange;

    return (
        <div style={{ perspective: '1000px', width: '100%', maxWidth: '560px', height: '260px', cursor: 'pointer' }} onClick={onFlip}>
            <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
            >
                {/* Front face */}
                <div style={{
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    borderRadius: '1.25rem', backgroundColor: 'var(--card-bg)',
                    border: `2px solid ${accent}40`,
                    boxShadow: `0 8px 32px ${accent}20`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '2rem', gap: '1rem'
                }}>
                    <div style={{ position: 'absolute', top: '1rem', left: '1.25rem', fontSize: '0.7rem', color: accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Question
                    </div>
                    <div style={{ position: 'absolute', top: '1rem', right: '1.25rem', backgroundColor: accent + '20', color: accent, borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.7rem', fontWeight: 600 }}>
                        Tap to reveal
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                        {front}
                    </p>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', borderRadius: '0 0 1.25rem 1.25rem', background: `linear-gradient(90deg, ${accent}, ${accent}80)` }} />
                </div>

                {/* Back face */}
                <div style={{
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: '1.25rem', backgroundColor: accent,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '2rem', gap: '0.75rem', color: 'white'
                }}>
                    <div style={{ position: 'absolute', top: '1rem', left: '1.25rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                        Answer
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.7 }}>
                        {back}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

// ─── Main Flashcards Component ───────────────────────────────────────────
const Flashcards = () => {
    const { flashcards, setFlashcards } = useData();
    const { user } = useAuth();

    // form
    const [front,    setFront]    = useState('');
    const [back,     setBack]     = useState('');
    const [deckName, setDeckName] = useState('');
    const [cardColor, setCardColor] = useState('orange');
    const [showForm,  setShowForm] = useState(false);
    const [editCard,  setEditCard] = useState(null);

    // study mode
    const [studyMode,   setStudyMode]   = useState(false);
    const [studyDeck,   setStudyDeck]   = useState(null); // null = all
    const [studyIndex,  setStudyIndex]  = useState(0);
    const [flipped,     setFlipped]     = useState(false);
    const [gotIt,       setGotIt]       = useState(new Set());
    const [studyList,   setStudyList]   = useState([]);
    const [showHidden,  setShowHidden]  = useState(false);

    // filter
    const [filterDeck, setFilterDeck] = useState('All');

    const CARD_COLORS = ['orange', 'blue', 'green', 'purple', 'rose', 'cyan'];

    // ── persist ───────────────────────────────────────────────────────
    const saveCards = useCallback(async (updated) => {
        setFlashcards(updated);
        if (!user?.token) return;
        try {
            await axios.post(`${BASE_URL}/api/data`, { flashcards: updated }, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` }
            });
        } catch (e) { console.error('Flashcard save failed:', e); }
    }, [user, setFlashcards]);

    // ── add card ──────────────────────────────────────────────────────
    const handleAdd = (e) => {
        e.preventDefault();
        if (!front.trim() || !back.trim()) return;
        const card = {
            id: Date.now(), front: front.trim(), back: back.trim(),
            deck: deckName.trim() || 'Default', color: cardColor,
            createdAt: new Date().toISOString()
        };
        saveCards([card, ...(flashcards || [])]);
        setFront(''); setBack(''); setDeckName(''); setCardColor('orange');
        setShowForm(false);
    };

    // ── delete ────────────────────────────────────────────────────────
    const handleDelete = (id) => saveCards((flashcards || []).filter(c => c.id !== id));

    // ── save edit ─────────────────────────────────────────────────────
    const handleEditSave = () => {
        if (!editCard) return;
        saveCards((flashcards || []).map(c => c.id === editCard.id ? editCard : c));
        setEditCard(null);
    };

    // ── start study ───────────────────────────────────────────────────
    const startStudy = (deckFilter) => {
        let cards = flashcards || [];
        if (deckFilter && deckFilter !== 'All') cards = cards.filter(c => c.deck === deckFilter);
        if (cards.length === 0) return;
        setStudyList([...cards].sort(() => Math.random() - 0.5));
        setStudyDeck(deckFilter || 'All');
        setStudyIndex(0);
        setFlipped(false);
        setGotIt(new Set());
        setStudyMode(true);
    };

    const exitStudy = () => { setStudyMode(false); setStudyList([]); setGotIt(new Set()); setFlipped(false); };

    const nextCard = () => {
        setFlipped(false);
        setTimeout(() => setStudyIndex(i => Math.min(i + 1, studyList.length - 1)), 150);
    };
    const prevCard = () => {
        setFlipped(false);
        setTimeout(() => setStudyIndex(i => Math.max(i - 1, 0)), 150);
    };

    const markGotIt = () => {
        setGotIt(prev => { const next = new Set(prev); next.add(studyList[studyIndex].id); return next; });
        if (studyIndex < studyList.length - 1) nextCard();
    };

    const shuffleStudy = () => {
        setStudyList(prev => [...prev].sort(() => Math.random() - 0.5));
        setStudyIndex(0); setFlipped(false);
    };

    // ── deck list ─────────────────────────────────────────────────────
    const allCards = flashcards || [];
    const decks    = ['All', ...new Set(allCards.map(c => c.deck))];
    const filtered = filterDeck === 'All' ? allCards : allCards.filter(c => c.deck === filterDeck);

    const currentCard = studyList[studyIndex];
    const studyProgress = studyList.length > 0 ? Math.round((gotIt.size / studyList.length) * 100) : 0;

    // ─────────────────────────────────────────────────────────────────
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── Study Mode UI ── */}
            <AnimatePresence>
                {studyMode && currentCard && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            style={{ backgroundColor: 'var(--bg-color)', borderRadius: '1.5rem', padding: '2rem', maxWidth: '640px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Study Mode</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        Card {studyIndex + 1} of {studyList.length} · {gotIt.size} mastered
                                    </div>
                                </div>
                                <button onClick={exitStudy} style={{ color: 'var(--text-secondary)' }}><X size={22} /></button>
                            </div>

                            {/* progress bar */}
                            <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
                                <motion.div animate={{ width: `${studyProgress}%` }} transition={{ duration: 0.4 }}
                                    style={{ height: '100%', borderRadius: '3px', backgroundColor: 'var(--success-color)' }} />
                            </div>

                            {/* flip card */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <FlipCard
                                    front={currentCard.front}
                                    back={currentCard.back}
                                    flipped={flipped}
                                    onFlip={() => setFlipped(v => !v)}
                                    color={currentCard.color}
                                />
                            </div>

                            {/* controls */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button onClick={prevCard} disabled={studyIndex === 0} className="btn-outline" style={{ padding: '0.6rem 1rem', opacity: studyIndex === 0 ? 0.4 : 1 }}>
                                    <ChevronLeft size={18} />
                                </button>
                                <button onClick={() => setFlipped(v => !v)} className="btn-outline" style={{ padding: '0.6rem 1.25rem' }}>
                                    <RotateCcw size={16} /> Flip
                                </button>
                                <button onClick={markGotIt} className="btn-primary" style={{ padding: '0.6rem 1.25rem', backgroundColor: gotIt.has(currentCard.id) ? 'var(--success-color)' : undefined }}>
                                    <Check size={16} /> Got it
                                </button>
                                <button onClick={shuffleStudy} className="btn-outline" style={{ padding: '0.6rem 1rem' }}>
                                    <Shuffle size={16} />
                                </button>
                                <button onClick={nextCard} disabled={studyIndex === studyList.length - 1} className="btn-outline" style={{ padding: '0.6rem 1rem', opacity: studyIndex === studyList.length - 1 ? 0.4 : 1 }}>
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            {/* mastered indicators */}
                            <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {studyList.map((c, i) => (
                                    <div key={c.id} style={{
                                        width: '10px', height: '10px', borderRadius: '50%',
                                        backgroundColor: gotIt.has(c.id) ? 'var(--success-color)' : i === studyIndex ? 'var(--primary-color)' : 'var(--border-color)',
                                        transition: 'background 0.3s'
                                    }} />
                                ))}
                            </div>

                            {studyProgress === 100 && (
                                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: '0.75rem', color: 'var(--success-color)', fontWeight: 700 }}>
                                    Outstanding — you mastered all cards in this session!
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Top Bar ── */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Flashcards</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{allCards.length} cards across {decks.length - 1} deck{decks.length !== 2 ? 's' : ''}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button onClick={() => startStudy(filterDeck !== 'All' ? filterDeck : null)} className="btn-outline" disabled={allCards.length === 0}
                        style={{ gap: '0.5rem', opacity: allCards.length === 0 ? 0.4 : 1 }}>
                        <BookOpen size={16} /> Study Now
                    </button>
                    <button onClick={() => setShowForm(v => !v)} className="btn-primary" style={{ gap: '0.5rem' }}>
                        <Plus size={16} /> New Card
                    </button>
                </div>
            </div>

            {/* ── Stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                {[
                    { label: 'Total Cards', value: allCards.length, color: 'var(--primary-color)' },
                    { label: 'Decks',       value: decks.length - 1, color: 'var(--purple-color)' },
                    { label: 'This Week',   value: allCards.filter(c => (Date.now() - new Date(c.createdAt)) < 7 * 86400000).length, color: 'var(--success-color)' },
                    { label: 'To Review',   value: allCards.length, color: 'var(--warning-color)' },
                ].map((s, i) => (
                    <div key={i} className="card" style={{ padding: '1rem', borderTop: `3px solid ${s.color}`, textAlign: 'center' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.value}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Add Card Form ── */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <div className="card" style={{ borderTop: '3px solid var(--primary-color)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Layers size={18} color="var(--primary-color)" /> New Flashcard
                            </h3>
                            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Deck / Topic</label>
                                        <input type="text" value={deckName} onChange={e => setDeckName(e.target.value)} placeholder="e.g. Biology Chapter 3" />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Card Color</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
                                            {CARD_COLORS.map(c => {
                                                const colorMap = { orange: '#ff6a00', blue: '#3b82f6', green: '#22c55e', purple: '#a855f7', rose: '#f43f5e', cyan: '#06b6d4' };
                                                return (
                                                    <button key={c} type="button" onClick={() => setCardColor(c)}
                                                        style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: colorMap[c], border: cardColor === c ? '3px solid var(--text-primary)' : '2px solid transparent', transition: 'border 0.15s' }} />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Question (Front)</label>
                                    <textarea rows={3} value={front} onChange={e => setFront(e.target.value)} required placeholder="What is...?" style={{ resize: 'vertical' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Answer (Back)</label>
                                    <textarea rows={3} value={back} onChange={e => setBack(e.target.value)} required placeholder="The answer is..." style={{ resize: 'vertical' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button type="submit" className="btn-primary"><Save size={16} /> Save Card</button>
                                    <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Deck filter tabs ── */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {decks.map(d => (
                    <button key={d} onClick={() => setFilterDeck(d)} style={{
                        padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem',
                        fontWeight: filterDeck === d ? 600 : 400,
                        backgroundColor: filterDeck === d ? 'var(--primary-color)' : 'var(--card-bg)',
                        color: filterDeck === d ? 'white' : 'var(--text-secondary)',
                        border: `1px solid ${filterDeck === d ? 'var(--primary-color)' : 'var(--border-color)'}`,
                        transition: 'all 0.2s'
                    }}>
                        {d} {d !== 'All' && `(${allCards.filter(c => c.deck === d).length})`}
                    </button>
                ))}
            </div>

            {/* ── Deck Study Buttons ── */}
            {decks.filter(d => d !== 'All').length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {decks.filter(d => d !== 'All').map(d => (
                        <button key={d} onClick={() => startStudy(d)} className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', gap: '0.4rem' }}>
                            <BookOpen size={14} /> Study "{d}"
                        </button>
                    ))}
                </div>
            )}

            {/* ── Cards Grid / Empty State ── */}
            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem 2rem' }}>
                    <Layers size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
                    <p style={{ fontWeight: 600 }}>No flashcards yet.</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Create your first card to start studying smarter.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    <AnimatePresence>
                        {filtered.map(card => {
                            const colorMap = { orange: '#ff6a00', blue: '#3b82f6', green: '#22c55e', purple: '#a855f7', rose: '#f43f5e', cyan: '#06b6d4' };
                            const accent = colorMap[card.color] || colorMap.orange;
                            return (
                                <motion.div key={card.id} layout initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
                                    whileHover={{ y: -3, boxShadow: `0 8px 24px ${accent}25` }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    style={{ backgroundColor: 'var(--card-bg)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--border-color)', borderTop: `3px solid ${accent}`, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '0.7rem', backgroundColor: accent + '20', color: accent, borderRadius: '999px', padding: '0.2rem 0.7rem', fontWeight: 600 }}>
                                            {card.deck}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                            <button onClick={() => setEditCard({ ...card })} style={{ color: 'var(--text-secondary)' }} title="Edit"><Edit3 size={14} /></button>
                                            <button onClick={() => handleDelete(card.id)} style={{ color: 'var(--danger-color)' }} title="Delete"><Trash2 size={14} /></button>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: accent, marginBottom: '0.35rem' }}>Question</div>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {card.front}
                                        </p>
                                    </div>

                                    <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            {showHidden ? <Eye size={11} /> : <EyeOff size={11} />} Answer
                                            <button onClick={() => setShowHidden(v => !v)} style={{ color: 'var(--text-secondary)', marginLeft: 'auto', fontSize: '0.7rem' }}>
                                                {showHidden ? 'Hide all' : 'Show all'}
                                            </button>
                                        </div>
                                        <p style={{ fontSize: '0.825rem', color: showHidden ? 'var(--text-secondary)' : 'transparent', backgroundColor: showHidden ? 'transparent' : 'var(--border-color)', borderRadius: '0.25rem', lineHeight: 1.5, transition: 'all 0.2s', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {card.back}
                                        </p>
                                    </div>

                                    <button onClick={() => startStudy(card.deck)} className="btn-outline" style={{ fontSize: '0.75rem', padding: '0.45rem 0.875rem', gap: '0.4rem', marginTop: 'auto' }}>
                                        <BookOpen size={13} /> Study this deck
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* ── Edit Modal ── */}
            <AnimatePresence>
                {editCard && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setEditCard(null)}
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            onClick={e => e.stopPropagation()} className="card"
                            style={{ maxWidth: '560px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '3px solid var(--primary-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Edit3 size={18} color="var(--primary-color)" /> Edit Card</h3>
                                <button onClick={() => setEditCard(null)} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Deck</label>
                                <input type="text" value={editCard.deck} onChange={e => setEditCard(c => ({ ...c, deck: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Question</label>
                                <textarea rows={3} value={editCard.front} onChange={e => setEditCard(c => ({ ...c, front: e.target.value }))} style={{ resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>Answer</label>
                                <textarea rows={3} value={editCard.back} onChange={e => setEditCard(c => ({ ...c, back: e.target.value }))} style={{ resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button onClick={() => setEditCard(null)} className="btn-outline">Cancel</button>
                                <button onClick={handleEditSave} className="btn-primary"><Save size={16} /> Save</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Flashcards;

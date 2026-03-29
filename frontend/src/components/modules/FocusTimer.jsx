import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

const FocusTimer = () => {
    const { addPomodoroSession } = useData();
    const [focusDuration, setFocusDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            clearInterval(interval);
            
            if (!isBreak) {
                // Focus finished
                addPomodoroSession(focusDuration);
                alert("Focus session completed! Time for a break.");
                setIsBreak(true);
                setTimeLeft(breakDuration * 60);
                setIsActive(true); // auto start break
            } else {
                // Break finished
                alert("Break completed! Ready to focus?");
                setIsBreak(false);
                setTimeLeft(focusDuration * 60);
                setIsActive(false);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, isBreak, focusDuration, breakDuration, addPomodoroSession]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setTimeLeft(focusDuration * 60);
    };

    // Update timer when inputs change (only if not active)
    useEffect(() => {
        if (!isActive && !isBreak) {
            setTimeLeft(focusDuration * 60);
        }
    }, [focusDuration, isActive, isBreak]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const totalSeconds = isBreak ? breakDuration * 60 : focusDuration * 60;
    const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}
        >
            <div className="card" style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: isBreak ? 'var(--success-color)' : 'var(--primary-color)', marginBottom: '2rem' }}>
                    {isBreak ? 'Break Time' : 'Focus Session'}
                </h2>
                
                {/* Circular Timer UI */}
                <div style={{ position: 'relative', width: '250px', height: '250px', borderRadius: '50%', background: `conic-gradient(${isBreak ? 'var(--success-color)' : 'var(--primary-color)'} ${progressPercent}%, var(--border-color) ${progressPercent}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)', marginBottom: '3rem' }}>
                    <div style={{ width: '230px', height: '230px', borderRadius: '50%', backgroundColor: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '4rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '-2px' }}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <button onClick={toggleTimer} className={isActive ? 'btn-outline' : 'btn-primary'} style={{ minWidth: '120px' }}>
                        {isActive ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start</>}
                    </button>
                    <button onClick={resetTimer} className="btn-outline" style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>
                        <RotateCcw size={20} /> Reset
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%' }}>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block', textAlign: 'center' }}>Focus Duration (min)</label>
                        <input type="number" value={focusDuration} onChange={e => setFocusDuration(parseInt(e.target.value) || 1)} min="1" max="120" style={{ textAlign: 'center', fontSize: '1.25rem' }} disabled={isActive} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block', textAlign: 'center' }}>Break Duration (min)</label>
                        <input type="number" value={breakDuration} onChange={e => setBreakDuration(parseInt(e.target.value) || 1)} min="1" max="30" style={{ textAlign: 'center', fontSize: '1.25rem' }} disabled={isActive} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FocusTimer;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, ArrowRight, ShieldCheck, Sparkles, Clock3 } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        const result = await login(email, password);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            setErrorMsg(result.error || 'Failed to login');
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-shell" style={{ position: 'relative' }}>
            <button
                onClick={toggleTheme}
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.5rem', borderRadius: '50%', color: 'var(--text-primary)', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <section className="auth-side" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <BrandLogo size={52} />
                        <strong style={{ fontSize: '1.1rem' }}>A.C.E Planner</strong>
                    </div>
                    <h1 style={{ marginTop: '1.2rem', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.12 }}>Welcome back. Your study flow is waiting.</h1>
                    <p style={{ marginTop: '0.8rem', color: 'var(--text-secondary)', maxWidth: '42ch' }}>
                        Continue from where you stopped, review pending tasks, and jump back into focused sessions in seconds.
                    </p>
                    <div className="auth-kpi">
                        <div><strong>92%</strong><p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Task completion</p></div>
                        <div><strong>14d</strong><p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Current streak</p></div>
                        <div><strong>3.8h</strong><p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Daily focus</p></div>
                    </div>
                </div>
                <div style={{ marginTop: '1.2rem', display: 'grid', gap: '0.45rem', color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><ShieldCheck size={14} color="var(--primary-color)" /> Secure authentication and personal data privacy</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><Clock3 size={14} color="var(--primary-color)" /> Instant sync of notes, timers, and progress</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><Sparkles size={14} color="var(--primary-color)" /> AI study support available whenever needed</span>
                </div>
            </section>

            <div className="card" style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.8rem' }}>
                        <BrandLogo size={70} />
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Sign in</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>Use your account to open your personalized dashboard.</p>
                </div>

                {errorMsg && (
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: '0.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                        <input 
                            type="email" 
                            required 
                            placeholder="student@university.edu" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.95rem' }} disabled={isLoading}>
                        {isLoading ? <span className="loader"></span> : <>Log In <ArrowRight size={16} /></>}
                    </button>
                </form>

                <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Sign up here</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

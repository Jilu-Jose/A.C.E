import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
    Moon, Sun, Target, Calendar, BarChart3, Clock, Rocket, ShieldCheck,
    Sparkles, BrainCircuit, CheckCircle2, ArrowRight, TrendingUp
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const LandingPage = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav style={{ padding: '1.2rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} aria-label="A.C.E home">
                    <BrandLogo size={58} />
                    <span style={{ fontWeight: 700, letterSpacing: '0.03em' }}>A.C.E Planner</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <button onClick={toggleTheme} style={{ padding: '0.55rem', borderRadius: '50%', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                    <Link to="/login" className="btn-outline">Log In</Link>
                    <Link to="/register" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            <main style={{ flex: 1, padding: '3rem 5% 4rem' }}>
                <section style={{ maxWidth: '1180px', margin: '0 auto' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', borderRadius: '999px', backgroundColor: 'rgba(249, 115, 22, 0.13)', color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.8rem' }}>
                        <Sparkles size={14} /> Student productivity suite
                    </div>
                    <h1 style={{ marginTop: '1rem', fontSize: 'clamp(2rem, 5vw, 3.6rem)', fontWeight: 800, lineHeight: 1.08, maxWidth: '740px' }}>
                        Plan faster, learn deeper, and keep your semester in control.
                    </h1>
                    <p style={{ marginTop: '1rem', maxWidth: '700px', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                        A modern workspace for classes, assignments, notes, and revision. Stay focused with timers, organize by subject, and use AI guidance only when you need it.
                    </p>
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn-primary" style={{ padding: '0.9rem 1.5rem' }}>
                            Start Free <ArrowRight size={16} />
                        </Link>
                        <Link to="/login" className="btn-outline" style={{ padding: '0.9rem 1.5rem' }}>
                            Open Dashboard
                        </Link>
                    </div>
                    <div className="hero-grid">
                        <div className="hero-card">
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.8rem' }}>Daily Momentum</h3>
                            <div style={{ display: 'grid', gap: '0.55rem' }}>
                                <StatLine icon={<TrendingUp size={14} />} label="Study streak" value="14 days" />
                                <StatLine icon={<CheckCircle2 size={14} />} label="Tasks completed" value="32 this week" />
                                <StatLine icon={<Clock size={14} />} label="Focus sessions" value="9 today" />
                            </div>
                        </div>
                        <div className="hero-card">
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.8rem' }}>Why students like A.C.E</h3>
                            <ul style={{ display: 'grid', gap: '0.55rem', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                                <li style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}><BrainCircuit size={14} color="var(--primary-color)" /> Clear weekly workflow with zero clutter</li>
                                <li style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}><Rocket size={14} color="var(--primary-color)" /> Faster revision with searchable smart notes</li>
                                <li style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}><ShieldCheck size={14} color="var(--primary-color)" /> One workspace for planning and progress</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section style={{ marginTop: '3rem' }}>
                    <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '1.9rem', fontWeight: 700, marginBottom: '1rem' }}>Built for peak academic performance</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
                            <FeatureCard icon={<Calendar size={22} color="var(--primary-color)" />} title="Smart Scheduling" desc="Organize weekly study blocks and never miss deadlines." />
                            <FeatureCard icon={<Clock size={22} color="var(--primary-color)" />} title="Focus Timer" desc="Structured deep-work sessions with rest intervals." />
                            <FeatureCard icon={<BarChart3 size={22} color="var(--primary-color)" />} title="Progress Analytics" desc="Track consistency and identify improvement areas." />
                            <FeatureCard icon={<Target size={22} color="var(--primary-color)" />} title="Goal Tracking" desc="Set outcomes and monitor your completion rate." />
                        </div>
                    </div>
                </section>
            </main>

            <footer style={{ padding: '1.4rem 5%', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                &copy; {new Date().getFullYear()} A.C.E Planner
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', alignItems: 'flex-start' }}>
        <div style={{ padding: '0.65rem', backgroundColor: 'rgba(249, 115, 22, 0.1)', borderRadius: '0.8rem' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.92rem' }}>{desc}</p>
    </div>
);

const StatLine = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.85rem', padding: '0.45rem 0.55rem', borderRadius: '0.65rem', backgroundColor: 'rgba(148,163,184,0.08)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>{icon} {label}</span>
        <strong style={{ fontSize: '0.8rem' }}>{value}</strong>
    </div>
);

export default LandingPage;

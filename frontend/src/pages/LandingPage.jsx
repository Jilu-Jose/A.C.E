import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Target, Calendar, BarChart3, Clock, Rocket, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav style={{ padding: '1.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>A</div>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px', color: 'var(--primary-color)' }}>.C.E</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={toggleTheme} style={{ padding: '0.5rem', borderRadius: '50%', color: 'var(--text-primary)' }}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" className="btn-outline">Log In</Link>
                        <Link to="/register" className="btn-primary">Get Started Free</Link>
                    </div>
                </div>
            </nav>

            <main style={{ flex: 1 }}>
                {/* Hero Section */}
                <section style={{ padding: '6rem 5%', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary-color)', borderRadius: '2rem', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        <Rocket size={16} /> Version 2.0 Now Available
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--primary-hover) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Master Your Studies with A.C.E Planner
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                        The ultimate study companion designed to enhance your focus, track assignments, and analyze performance statistics with real AI insights.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/register" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                            Start Your Journey <Target size={20} />
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section style={{ padding: '5rem 5%', backgroundColor: 'var(--card-bg)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Built for Peak Academic Performance</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                        <FeatureCard 
                            icon={<Calendar size={32} color="var(--primary-color)" />}
                            title="Smart Scheduling"
                            desc="Organize your weekly learning blocks and never miss an assignment deadline again."
                        />
                        <FeatureCard 
                            icon={<Clock size={32} color="var(--primary-color)" />}
                            title="Focus Pomodoro"
                            desc="Maximize your deep work intervals using our built-in customized Pomodoro timer."
                        />
                        <FeatureCard 
                            icon={<BarChart3 size={32} color="var(--primary-color)" />}
                            title="Advanced Analytics"
                            desc="Track your study hours, session streaks, and performance statistics across subjects."
                        />
                         <FeatureCard 
                            icon={<ShieldCheck size={32} color="var(--primary-color)" />}
                            title="AI Study Assistant"
                            desc="Powered by Google Gemini, instantly ask questions and receive study-focused breakdowns."
                        />
                    </div>
                </section>
            </main>

            <footer style={{ padding: '2rem 5%', textAlign: 'center', backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                &copy; {new Date().getFullYear()} A.C.E Planner. Built for students targeting excellence.
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ padding: '1rem', backgroundColor: 'rgba(249, 115, 22, 0.1)', borderRadius: '1rem' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
    </div>
);

export default LandingPage;

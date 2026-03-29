import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BASE_URL from '../utils/apiBase';

const Chatbot = ({ onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm A.C.E AI. How can I help you study today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            
            const { data } = await axios.post(`${BASE_URL}/api/chat`, { prompt: userMsg.text }, config);
            
            setMessages((prev) => [...prev, { id: Date.now() + 1, text: data.reply, sender: 'bot' }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev, 
                { id: Date.now() + 1, text: "Sorry, I couldn't reach the server right now.", sender: 'bot' }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '6rem',
            right: '2rem',
            width: '350px',
            height: '500px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '1rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 100
        }}>
            {/* Header */}
            <div style={{ padding: '1rem', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <Bot size={20} /> AI Study Assistant
                </div>
                <button onClick={onClose} style={{ color: 'white', padding: '0.25rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-color)' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                        {msg.sender === 'bot' && (
                            <div style={{ minWidth: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bot size={16} />
                            </div>
                        )}
                        <div style={{ padding: '0.75rem 1rem', borderRadius: '1rem', borderTopRightRadius: msg.sender === 'user' ? 0 : '1rem', borderTopLeftRadius: msg.sender === 'bot' ? 0 : '1rem', backgroundColor: msg.sender === 'user' ? 'var(--primary-color)' : 'var(--card-bg)', color: msg.sender === 'user' ? 'white' : 'var(--text-primary)', border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={16} />
                        </div>
                        <div style={{ padding: '0.75rem 1rem', borderRadius: '1rem', borderTopLeftRadius: 0, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', padding: '1rem', backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a study question..."
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '2rem' }}
                />
                <button type="submit" disabled={!input.trim() || isTyping} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: input.trim() && !isTyping ? 'var(--primary-color)' : 'var(--border-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s', flexShrink: 0 }}>
                    <Send size={18} style={{ marginLeft: '-2px', marginTop: '2px' }} />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;

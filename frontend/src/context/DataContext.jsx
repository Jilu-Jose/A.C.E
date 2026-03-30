import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import BASE_URL from '../utils/apiBase';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    // Core data state
    const [subjects,         setSubjects]         = useState([]);
    const [tasks,            setTasks]             = useState([]);
    const [schedule,         setSchedule]          = useState([]);
    const [notes,            setNotes]             = useState([]);
    const [pomodoroSessions, setPomodoroSessions]  = useState([]);
    const [flashcards,       setFlashcards]        = useState([]);
    const [loadingData,      setLoadingData]       = useState(true);
    const [syncError,        setSyncError]         = useState(null);

    // ── Fetch data on login ──────────────────────────────────────────
    useEffect(() => {
        if (user && user.token) {
            fetchData();
        } else {
            // Reset everything on logout
            setSubjects([]);
            setTasks([]);
            setSchedule([]);
            setNotes([]);
            setPomodoroSessions([]);
            setFlashcards([]);
            setLoadingData(false);
            setSyncError(null);
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoadingData(true);
            setSyncError(null);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${BASE_URL}/api/data`, config);

            setSubjects(data.subjects             || []);
            setTasks(data.tasks                   || []);
            setSchedule(data.schedule             || []);
            setNotes(data.notes                   || []);
            setPomodoroSessions(data.pomodoroSessions || []);
            setFlashcards(data.flashcards         || []);
        } catch (error) {
            console.error('Error fetching data from MongoDB:', error);
            setSyncError('Failed to load data. Check your connection.');
        } finally {
            setLoadingData(false);
        }
    };

    // ── Generic save — only sends the fields provided ────────────────
    const saveToBackend = useCallback(async (payload) => {
        if (!user?.token) return;
        try {
            setSyncError(null);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.post(`${BASE_URL}/api/data`, payload, config);
        } catch (error) {
            console.error('Sync to MongoDB failed:', error);
            setSyncError('Failed to save. Changes may not persist.');
        }
    }, [user]);

    // ── Subjects ─────────────────────────────────────────────────────
    const addSubject = (subject) => {
        const updated = [...subjects, { ...subject, id: Date.now() }];
        setSubjects(updated);
        saveToBackend({ subjects: updated });
    };

    const deleteSubject = (id) => {
        const updated = subjects.filter(s => s.id !== id);
        setSubjects(updated);
        saveToBackend({ subjects: updated });
    };

    // ── Tasks ────────────────────────────────────────────────────────
    const addTask = (task) => {
        const updated = [...tasks, { ...task, id: Date.now(), completed: false }];
        setTasks(updated);
        saveToBackend({ tasks: updated });
    };

    const toggleTask = (id) => {
        const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        setTasks(updated);
        saveToBackend({ tasks: updated });
    };

    const deleteTask = (id) => {
        const updated = tasks.filter(t => t.id !== id);
        setTasks(updated);
        saveToBackend({ tasks: updated });
    };

    // ── Schedule ─────────────────────────────────────────────────────
    const addSchedule = (item) => {
        const updated = [...schedule, { ...item, id: Date.now() }];
        setSchedule(updated);
        saveToBackend({ schedule: updated });
    };

    const deleteSchedule = (id) => {
        const updated = schedule.filter(s => s.id !== id);
        setSchedule(updated);
        saveToBackend({ schedule: updated });
    };

    // ── Notes — fully managed here so sync always happens ────────────
    const saveNotes = (updated) => {
        setNotes(updated);
        saveToBackend({ notes: updated });
    };

    // ── Flashcards — fully managed here so sync always happens ───────
    const saveFlashcards = (updated) => {
        setFlashcards(updated);
        saveToBackend({ flashcards: updated });
    };

    // ── Pomodoro ─────────────────────────────────────────────────────
    const addPomodoroSession = (duration) => {
        const updated = [...pomodoroSessions, { date: new Date().toISOString(), duration }];
        setPomodoroSessions(updated);
        saveToBackend({ pomodoroSessions: updated });
    };

    return (
        <DataContext.Provider value={{
            // State
            subjects, tasks, schedule, notes, pomodoroSessions, flashcards,
            loadingData, syncError,
            // Subjects
            addSubject, deleteSubject,
            // Tasks
            addTask, toggleTask, deleteTask,
            // Schedule
            addSchedule, deleteSchedule,
            // Notes  — components call saveNotes(newNotesArray)
            saveNotes,
            // Flashcards — components call saveFlashcards(newCardsArray)
            saveFlashcards,
            // Pomodoro
            addPomodoroSession,
            // Manual refresh
            refreshData: fetchData,
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);

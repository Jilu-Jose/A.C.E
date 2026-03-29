import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    
    // Core data vectors
    const [subjects, setSubjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [notes, setNotes] = useState([]);
    const [pomodoroSessions, setPomodoroSessions] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // Fetch data when user logs in
    useEffect(() => {
        if (user && user.token) {
            fetchData();
        } else {
            // Reset state if logged out
            setSubjects([]);
            setTasks([]);
            setSchedule([]);
            setNotes([]);
            setPomodoroSessions([]);
            setLoadingData(false);
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoadingData(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/data', config);
            
            setSubjects(data.subjects || []);
            setTasks(data.tasks || []);
            setSchedule(data.schedule || []);
            setNotes(data.notes || []);
            setPomodoroSessions(data.pomodoroSessions || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    // Generic save function that pushes current state to backend
    const saveToBackend = async (payload) => {
        if (!user || !user.token) return;
        
        try {
            const config = { 
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}` 
                } 
            };
            await axios.post('/api/data', payload, config);
        } catch (error) {
            console.error('Failed to sync to cloud:', error);
        }
    };

    // Mutators with auto-sync
    const addSubject = (subject) => {
        const newSubjects = [...subjects, { ...subject, id: Date.now() }];
        setSubjects(newSubjects);
        saveToBackend({ subjects: newSubjects });
    };

    const deleteSubject = (id) => {
        const newSubjects = subjects.filter(s => s.id !== id);
        setSubjects(newSubjects);
        saveToBackend({ subjects: newSubjects });
    };

    const addTask = (task) => {
        const newTasks = [...tasks, { ...task, id: Date.now(), completed: false }];
        setTasks(newTasks);
        saveToBackend({ tasks: newTasks });
    };

    const toggleTask = (id) => {
        const newTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        setTasks(newTasks);
        saveToBackend({ tasks: newTasks });
    };

    const deleteTask = (id) => {
        const newTasks = tasks.filter(t => t.id !== id);
        setTasks(newTasks);
        saveToBackend({ tasks: newTasks });
    };

    const addSchedule = (item) => {
        const newSchedule = [...schedule, { ...item, id: Date.now() }];
        setSchedule(newSchedule);
        saveToBackend({ schedule: newSchedule });
    };

    const deleteSchedule = (id) => {
        const newSchedule = schedule.filter(s => s.id !== id);
        setSchedule(newSchedule);
        saveToBackend({ schedule: newSchedule });
    };

    const addPomodoroSession = (duration) => {
        const newSessions = [...pomodoroSessions, { date: new Date().toISOString(), duration }];
        setPomodoroSessions(newSessions);
        saveToBackend({ pomodoroSessions: newSessions });
    };

    return (
        <DataContext.Provider value={{
            subjects, tasks, schedule, notes, pomodoroSessions, loadingData,
            addSubject, deleteSubject, addTask, toggleTask, deleteTask,
            addSchedule, deleteSchedule, addPomodoroSession, setNotes
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);

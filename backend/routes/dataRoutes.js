import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get all user data
// @route   GET /api/data
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            subjects:         user.subjects         || [],
            tasks:            user.tasks            || [],
            schedule:         user.schedule         || [],
            notes:            user.notes            || [],
            pomodoroSessions: user.pomodoroSessions || [],
            flashcards:       user.flashcards       || [],
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Save / update user data arrays (partial update — only provided keys are overwritten)
// @route   POST /api/data
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only overwrite a field if it was explicitly sent in the request body
        if (req.body.subjects         !== undefined) user.subjects         = req.body.subjects;
        if (req.body.tasks            !== undefined) user.tasks            = req.body.tasks;
        if (req.body.schedule         !== undefined) user.schedule         = req.body.schedule;
        if (req.body.notes            !== undefined) user.notes            = req.body.notes;
        if (req.body.pomodoroSessions !== undefined) user.pomodoroSessions = req.body.pomodoroSessions;
        if (req.body.flashcards       !== undefined) user.flashcards       = req.body.flashcards;

        const saved = await user.save();

        res.json({
            message: 'Data saved successfully',
            data: {
                subjects:         saved.subjects,
                tasks:            saved.tasks,
                schedule:         saved.schedule,
                notes:            saved.notes,
                pomodoroSessions: saved.pomodoroSessions,
                flashcards:       saved.flashcards,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

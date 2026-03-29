import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get user data arrays
// @route   GET /api/data
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                subjects: user.subjects,
                tasks: user.tasks,
                schedule: user.schedule,
                notes: user.notes,
                pomodoroSessions: user.pomodoroSessions
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user data arrays
// @route   POST /api/data
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.subjects = req.body.subjects !== undefined ? req.body.subjects : user.subjects;
            user.tasks = req.body.tasks !== undefined ? req.body.tasks : user.tasks;
            user.schedule = req.body.schedule !== undefined ? req.body.schedule : user.schedule;
            user.notes = req.body.notes !== undefined ? req.body.notes : user.notes;
            user.pomodoroSessions = req.body.pomodoroSessions !== undefined ? req.body.pomodoroSessions : user.pomodoroSessions;

            const updatedUser = await user.save();

            res.json({
                message: 'Data saved successfully',
                data: {
                    subjects: updatedUser.subjects,
                    tasks: updatedUser.tasks,
                    schedule: updatedUser.schedule,
                    notes: updatedUser.notes,
                    pomodoroSessions: updatedUser.pomodoroSessions
                }
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

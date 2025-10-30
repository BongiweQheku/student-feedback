const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./feedback.db');

// GET all feedback
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM feedback ORDER BY createdAt DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// POST new feedback
router.post('/', (req, res) => {
    const { studentName, courseCode, comments, rating } = req.body;
    
    // Basic validation
    if (!studentName || !courseCode || !comments || !rating) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const sql = `INSERT INTO feedback (studentName, courseCode, comments, rating) 
                 VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [studentName, courseCode, comments, rating], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Feedback submitted successfully',
            data: { id: this.lastID }
        });
    });
});

// DELETE feedback (Bonus feature)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM feedback WHERE id = ?';
    
    db.run(sql, id, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Feedback deleted successfully' });
    });
});

module.exports = router;
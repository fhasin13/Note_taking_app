/**
 * Note Routes
 * 
 * Defines all routes related to notes.
 */

const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// POST /api/notes - Create new note
// Access: Editor, Contributor, Lead Editor, Admin
router.post('/', noteController.createNote);

// GET /api/notes - Get all notes (with optional filters)
router.get('/', noteController.getNotes);

// GET /api/notes/:id - Get single note by ID
router.get('/:id', noteController.getNoteById);

// PUT /api/notes/:id - Update note
// Access: Editor, Lead Editor, Admin, or note owner
router.put('/:id', noteController.updateNote);

// DELETE /api/notes/:id - Delete note
// Access: Editor, Lead Editor, Admin, or note owner
router.delete('/:id', noteController.deleteNote);

// POST /api/notes/:id/tags - Add tag to note
router.post('/:id/tags', noteController.addTagToNote);

module.exports = router;


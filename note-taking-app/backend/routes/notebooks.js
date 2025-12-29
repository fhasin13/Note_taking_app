/**
 * Notebook Routes
 */

const express = require('express');
const router = express.Router();
const notebookController = require('../controllers/notebookController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', notebookController.createNotebook);
router.get('/', notebookController.getNotebooks);
router.get('/:id', notebookController.getNotebookById);
router.put('/:id', notebookController.updateNotebook);
router.delete('/:id', notebookController.deleteNotebook);
router.post('/:id/notes', notebookController.addNoteToNotebook);

module.exports = router;


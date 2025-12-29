/**
 * Tag Routes
 */

const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', tagController.createTag);
router.get('/', tagController.getTags);
router.delete('/:id', tagController.deleteTag);

module.exports = router;


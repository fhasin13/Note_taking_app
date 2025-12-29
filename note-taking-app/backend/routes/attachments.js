/**
 * Attachment Routes
 */

const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/attachmentController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', attachmentController.createAttachment);
router.get('/', attachmentController.getAttachments);
router.delete('/:id', attachmentController.deleteAttachment);

module.exports = router;


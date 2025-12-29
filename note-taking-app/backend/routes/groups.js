/**
 * Group Routes
 */

const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', groupController.createGroup);
router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroupById);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);
router.post('/:id/members', groupController.addMemberToGroup);

module.exports = router;


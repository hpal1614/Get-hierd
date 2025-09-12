const express = require('express');
const { chatRefine } = require('../controllers/chatController');
const { checkQuota } = require('../middleware/tokenTracker');

const router = express.Router();

router.post('/refine', checkQuota, chatRefine);

module.exports = router;



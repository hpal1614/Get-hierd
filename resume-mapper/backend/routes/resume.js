const express = require('express');
const multer = require('multer');
const { uploadAndParse } = require('../controllers/resumeController');
const { checkQuota } = require('../middleware/tokenTracker');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), uploadAndParse);

module.exports = router;



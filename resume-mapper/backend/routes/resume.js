const express = require('express');
const multer = require('multer');
const { uploadAndParse, overlayUpdate, generateResume } = require('../controllers/resumeController');
const { uploadAlterations } = require('../controllers/alterationsController');
const { adaptResumeToJobDescription, generateJobAdaptedResume } = require('../controllers/jobResumeController');
const { checkQuota } = require('../middleware/tokenTracker');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), uploadAndParse);
router.post('/alterations', upload.single('file'), uploadAlterations);
router.post('/overlay-update', upload.single('file'), overlayUpdate);
router.post('/generate', generateResume);

// Job-based resume adaptation routes
router.post('/adapt-to-job', adaptResumeToJobDescription);
router.post('/generate-job-resume', generateJobAdaptedResume);

module.exports = router;



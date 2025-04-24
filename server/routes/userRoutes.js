const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const extractText = require('../utils/pdfParser');
const { extractSkills } = require('../services/skillAnalyzer');
const {
  registerUser,
  loginUser,
  analyzeSkills
} = require('../controllers/userController');

// @route   POST /api/users/register
router.post('/register', registerUser);

// @route   POST /api/users/login
router.post('/login', loginUser);

// @route   POST /api/users/analyze
// @body    { resumeText: "..." }
router.post('/analyze', analyzeSkills);

// @route   POST /api/users/uploadResume
// @form-data  resume: <PDF file>
router.post('/uploadResume', upload.single('resume'), async (req, res) => {
  try {
    const text = await extractText(req.file.path);
    const skills = extractSkills(text);
    res.json({ extractedSkills: skills });
  } catch (err) {
    res.status(500).json({
      message: 'Error parsing PDF',
      error: err.message
    });
  }
});

module.exports = router;

const express = require('express');
const { registerUser, loginUser, analyzeSkills } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/analyze', analyzeSkills);

module.exports = router;

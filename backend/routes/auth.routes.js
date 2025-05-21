const express = require('express');
const router = express.Router();
const { updateRole, register, login, logout } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/update', updateRole);
router.post('/login', login);
router.post('/logout', verifyToken, logout);

module.exports = router;

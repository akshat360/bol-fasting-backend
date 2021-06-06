const Users = require('../models/user.model');
const router = require('express').Router();
const { signup, signin } = require('../controller/auth.controller');

router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;

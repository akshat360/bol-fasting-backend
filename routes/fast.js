const Fast = require('../models/fast.model');
const router = require('express').Router();
const {
  createFast,
  updateFast,
  endFast,
} = require('../controller/fast.controller');

router.post('/create', createFast);
router.post('/update', updateFast);
router.post('/end', endFast);

module.exports = router;

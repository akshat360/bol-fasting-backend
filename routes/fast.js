const router = require('express').Router();
const {
  getUserAllFasts,
  getFast,
  createFast,
  updateFast,
  endFast,
  getCurrentFast,
} = require('../controller/fast.controller');

router.post('/current', getCurrentFast);
router.post('/details', getUserAllFasts);
router.post('/create', createFast);
router.post('/update', updateFast);
router.post('/end', endFast);
// router.post('/', getFast);

module.exports = router;

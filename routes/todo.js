const express = require('express');
const router = express.Router();

router.get('/', todoController)
module.exports = router;
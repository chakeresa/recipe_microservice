var express = require('express');
var router = express.Router();

/* GET recipes based on food type. */
router.get('/food_search', function(req, res, next) {
  res.status(200).send({ message: 'hello' });
});

module.exports = router;

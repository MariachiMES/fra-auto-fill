var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', async (req, res, next) => {
	console.log(req);
	res.status(200);
});

module.exports = router;

const router = require('express').Router();

router.post('/', async (req, res) => {
	res.send('pdfRoutes');
});

module.exports = router;

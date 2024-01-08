const router = require('express').Router();

router.get('/', async (req, res) => {
	res.render('.index.html');
});

router.get('/dashboard', async (req, res) => {
	res.render('.dashboard.html');
});

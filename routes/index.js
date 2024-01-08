var express = require('express');
var router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

/* GET home page. */
router.get('/', function (req, res, next) {
	console.log(req.oidc.isAuthenticated());
	const userInfo = req.oidc.user;
	if (req.oidc.isAuthenticated() === true) {
		return res.redirect('/dashboard');
	}
	res.render('index');
});

router.get('/dashboard', requiresAuth(), (req, res) => {
	res.render('dashboard');
});

router.get('/login', (req, res) => {
	console.log(req, res);
});

//Plans for sale
const plansForSale = new Map([
	[1, { priceInCents: 2500, name: 'One Time Payment' }],
	[2, { priceInCents: 1200, name: 'Monthly Payment' }],
	[3, { priceInCents: 5000, name: 'Lifetime Donation' }],
]);
router.get('/pricing', requiresAuth(), (req, res) => {
	res.render('pricing');
});

module.exports = router;

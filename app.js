require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
const fraRouter = require('./routes/fra');
const ariRouter = require('./routes/ari');
var usersRouter = require('./routes/users');

//AUTH 0 STUFF
const { auth, requiresAuth } = require('express-openid-connect');

const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.AUTH0_SECRET,
	baseURL: process.env.AUTH0_BASE_URL,
	clientID: process.env.AUTH0_CLIENT_ID,
	issuerBaseURL: process.env.AUTH0_DOMAIN,
};

var app = express();

//AUTH0 Router

app.use(auth(config));
// app.get('/', (req, res) => {
// 	res.send( ? 'Logged In' : 'Logged Out');
// });

// app.get('/', requiresAuth(), (req, res) => {
// 	res.send(JSON.stringify(req.oidc.user));
// });

// const { auth } = require('express-oauth2-jwt-bearer');

// const jwtCheck = auth({
// 	audience: 'https://www.cmutility.com',
// 	issuerBaseURL: 'https://dev-kqmyq3jxqv2eifr6.us.auth0.com/',
// 	tokenSigningAlg: 'RS256',
// });

// // enforce on all endpoints
// app.use(jwtCheck);

app.get('/authorized', function (req, res) {
	res.send('Secured Resource');
});

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/fra', fraRouter);
app.use('/ari', ariRouter);
app.use(bodyParser.urlencoded({ extended: false }));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

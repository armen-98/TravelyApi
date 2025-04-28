const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const i18n = require('i18n');
const fs = require('fs');
const locales = fs.readdirSync('./locales');
const languageMiddleware = require('./helpers/setLocale');

const indexRouter = require('./routes');

const app = express();
app.use(cors({ origin: '*' }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

i18n.configure({
  locales: locales.map((locale) => locale.split('.')[0]),
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  autoReload: true,
  updateFiles: false,
  syncFiles: true,
});

app.use(i18n.init);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(languageMiddleware);
app.use('/api', indexRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

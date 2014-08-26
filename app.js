var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./config.json');
var transporter = nodemailer.createTransport(config.smtp);
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var objToString = function(obj) {
  var str = '';
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str += p + ': ' + obj[p] + '<br>';
    }
  }
  return str;
};

app.get('/message/send', function(req, res, next) {
  transporter.sendMail({
    from: config.sendmail.from,
    to: config.sendmail.to,
    subject: config.sendmail.subject,
    html: objToString(req.query)
  }, function(err) {
    if (err) return next(err);
    res.send('success');
  });
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;

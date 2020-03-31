// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-passport
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const express = require('express');
const session = require('client-sessions');
const path = require('path');
const app = (module.exports = express());

/**
 * This is a mock web app to show case local user sessions with third party oauth2 providers
 *
 * This web app has required express middleware to enable user HTTP sessions,
 * and endpoints to render pages
 */

/**
 * we use jade templates
 *
 * jade templates copied from loopback-example-passport
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * we use 'client-sessions' to enable saving client side sessions
 */
app.use(
  session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  }),
);

/**
 * Middleware to look up user profile in the session
 */
app.use(function (req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    next();
  }
});

/**
 * Middleware to enforce login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function requireLogin(req, res, next) {
  if (!req.user) {
    res.sendStatus(401);
  } else {
    next();
  }
}

/**
 * Render Index page
 */
app.get('/', function (req, res, next) {
  res.render('pages/index', {user: req.user, url: req.url});
});

/**
 * Render account profile
 */
app.get('/auth/account', requireLogin, function (req, res, next) {
  res.render('pages/loginProfiles', {
    user: req.user,
    url: req.url,
  });
});

/**
 * render login page
 */
app.get('/login', function (req, res, next) {
  res.render('pages/login', {
    user: req.user,
    url: req.url,
  });
});

/**
 * logout current session
 */
app.get('/logout', function (req, res) {
  req.session.reset();
  res.redirect('/');
});

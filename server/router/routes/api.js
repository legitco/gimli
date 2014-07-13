var auth = require('../../lib/auth');
var api = require('../../controllers/api');
var github = require('../../controllers/github');
var errors = require('../../controllers/errors');
var markdown = require('../../lib/markdown');

var express = require('express');
var router = express.Router();

// /api routes
router.use('/', auth.ensureAuthenticated); // Confirm logged in
router.use('/', github.client);
router.get('/user', api.user);
router.get('/repos', github.repos);
router.post('/repos/:owner/:repo/subscribe', github.subscribe);
router.get('/:owner/:repo/issues', github.issues);
router.get('/:owner/:repo/issue/:number', github.issue);
router.get('/:owner/:repo/issue/:number/comments', github.comments);
router.post('/:owner/:repo/issue/:number/comments', github.createComment);
router.post('/:owner/:repo/markdown', markdown.render);
router.use('/', errors.apiNotFound);

module.exports = router;

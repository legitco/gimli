var auth = require('../lib/auth');
var api = require('../controllers/api');
var page = require('../controllers/page');
var github = require('../controllers/github');
var errors = require('../controllers/errors');
var markdown = require('../lib/markdown');

module.exports = function(app) {
    // Index
    app.get('/', page.index);

    // Test Error
    app.get('/error', function(req, res, next) {
    	next(new Error('Test Error'));
    });

    // Auth
    app.get('/logout', auth.logout);
    app.get('/login', auth.githubLogin);
    app.get('/auth/github/callback', auth.githubCallback, auth.githubSuccess);

    // Jade Partials for Angular Templates
    app.get('/views/*', function(req, res) {
        res.render(req.path.substr(7));
    });

    // API Routes
    app.use('/api', require('./routes/api'));

    // Github Notifications
    app.post('/notice/issue', github.notice);

    // Serve root index page for all other routes
    app.use(page.index);

    //Error Handling
    app.use(errors.log);
    app.use('/api', errors.apiError);
    app.use(errors.error);
};
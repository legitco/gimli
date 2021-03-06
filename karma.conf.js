// Karma configuration
// Generated on Wed May 14 2014 22:45:19 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/mocha/mocha.js',
      'node_modules/chai/chai.js',
      'vendor/jquery/dist/jquery.min.js',
      'vendor/angular/angular.js',
      'vendor/angular-faye/build/angular-faye.js',
      'vendor/marked/lib/marked.js',
      'vendor/highlightjs/highlight.pack.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-mocks/angular-mocks.js',
      'vendor/angular-marked/angular-marked.js',
      'client/scripts/**/*.js',
      'test/client/**/*Spec.js'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
    // browsers: ['Chrome', 'Firefox', 'Opera'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};

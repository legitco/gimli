module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-coveralls');

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'server.js', '{server,client}/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        expr: true,
        latedef: true,
        onevar: true,
        noarg: true,
        node: true,
        trailing: true,
        undef: true,
        unused: false,
        globals: {
          angular: true,
          jQuery: true,
          console: true,
          module: true,
          document: true,
          /* MOCHA */
          describe: false,
          it: false,
          before: false,
          beforeEach: false,
          after: false,
          afterEach: false
        }
      }
    },
    copy: {
      options: {
        expand: true
      },
      views: {
        files: [
          { expand: true, cwd: 'client', src: ['views/**'], dest: 'dist/static' }
        ]
      },
      images: {
        files: [
          { expand: true, cwd: 'client', src: ['images/**'], dest: 'dist/static' }
        ]
      },
      fonts: {
        files: [
          { expand: true, cwd: 'client', src: ['fonts/**'], dest: 'dist/static' }
        ]
      },
      clientScripts: {
        files: [
          { expand: true, cwd: 'client', src: ['scripts/**'], dest: 'dist/static' }
        ]
      },
      vendor: {
        files: [
          { expand: true, src: ['vendor/**'], dest: 'dist/static' }
        ]
      }
    },
    stylus: {
      options: {
        paths: ['client/styles']
      },
      compile: {
        files: {
          'dist/static/styles/global.css': 'client/styles/global.styl'
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          ignore: ['node_modules/'],
          verbose: true,
          ext: 'js',
          watch: 'server/**/*.js'
        }
      }
    },
    mochaTest: {
      server: {
        options: {
          reporter: 'spec',
          clearRequireCache: true,
          require: 'test/coverage/blanket'
        },
        src: ['test/server/**/*.js']
      },
      coverage: {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          captureFile: 'test/coverage/coverage.lcov'
        },
        src: ['test/server/**/*.js']
      },
      coverageHtml: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'test/coverage/coverage.html'
        },
        src: ['test/server/**/*.js']
      },
      coverageFail: {
        options: {
          reporter: 'travis-cov'
        },
        src: ['test/server/**/*.js']
      }
    },
    coveralls: {
      options: {
        // When true, grunt-coveralls will only print a warning rather than
        // an error, to prevent CI builds from failing unnecessarily (e.g. if
        // coveralls.io is down). Optional, defaults to false.
        force: true
      },
      gimli: {
        src: 'test/coverage/coverage.lcov'
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      continuous: {
        singleRun: false,
        browsers: ['PhantomJS']
      },
      test: {
        browsers: ['Chrome', 'PhantomJS']
      },
      travis: {
        browsers: ['Firefox', 'PhantomJS']
      }
    },
    env: {
      options : {
        //Shared Options Hash
      },
      dev: {
        NODE_ENV: 'development',
        PORT: 3000,
        COOKIE_SECRET: 'gimli-cookie',
        REDIS_URL: 'redis://localhost:6379',
        MONGO_URL: 'mongodb://localhost/gimli-dev',
        GIMLI_REDIRECT_URL: 'http://localhost:3000/auth/github/callback',
        src: '.env'
      },
      test: {
        NODE_ENV : 'test',
        PORT: 3000,
        COOKIE_SECRET: 'gimli-cookie-test',
        REDIS_URL: 'redis://localhost:6379',
        MONGO_URL: 'mongodb://localhost/gimli-test',
        GIMLI_REDIRECT_URL: 'http://localhost:3000/auth/github/callback',
        GITHUB_CLIENT_ID: 'github-client-id',
        GITHUB_CLIENT_SECRET: 'github-client-secret'
      }
    },
    watch: {
      dev: {
        files: ['client/**', 'server/**', 'server.js'],
        tasks: ['jshint', 'build']
      },
      test: {
        files: ['client/**', 'server/**', 'server.js', 'test/**'],
        tasks: ['test']
      },
      server: {
        files: ['server/**', 'server.js', 'test/server/**'],
        tasks: ['mochaTest']
      }
    }
  });

  // Run tests
  grunt.registerTask('test-server',       ['env:test', 'watch:server']);
  grunt.registerTask('test',              ['env:test', 'jshint', 'mochaTest', 'karma:test']);
  grunt.registerTask('travis',            ['env:test', 'jshint', 'mochaTest', 'karma:travis', 'coveralls']);
  grunt.registerTask('ci',                ['watch:test']);

  // How to build
  grunt.registerTask('build',             ['jshint', 'concat', 'copy', 'stylus']);
  grunt.registerTask('heroku:production', ['build']);

  // How to run
  grunt.registerTask('start',             ['env:dev', 'nodemon']);

  // Build and watch
  grunt.registerTask('dev',               ['build', 'watch:dev']);
  grunt.registerTask('default',           ['dev']);
};

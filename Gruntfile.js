module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-stylus');

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-nodemon');

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
          { expand: true, cwd: 'client', src: ['views/**'], dest: 'dist' }
        ]
      },
      images: {
        files: [
          { expand: true, cwd: 'client', src: ['images/**'], dest: 'dist/static' }
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
    watch: {
      dev: {
        files: ['client/**', 'server/**', 'server.js'],
        tasks: ['jshint', 'build']
      },
      test: {
        files: ['client/**', 'server/**', 'server.js', 'test/**'],
        tasks: ['test']
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          ignore: ['node_modules/'],
          verbose: true,
          ext: 'js'
        }
      }
    },
    mochaTest: {
      test: {
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
    env: {
      options : {
        //Shared Options Hash
      },
      dev: {
        NODE_ENV: 'development',
        PORT: 3000,
        COOKIE_SECRET: 'gimli-cookie',
        GITHUB_CLIENT_ID: 'github-client-id',
        GITHUB_CLIENT_SECRET: 'github-client-secret',
        REDISCLOUD_URL: 'redis://localhost:6379',
        GIMLI_REDIRECT_URL: 'http://localhost:3000/auth/github/callback',
        src: '.env'
      },
      test: {
        NODE_ENV : 'test',
        PORT: 3000,
        COOKIE_SECRET: 'gimli-cookie-test',
        GITHUB_CLIENT_ID: 'github-client-id',
        GITHUB_CLIENT_SECRET: 'github-client-secret',
        REDISCLOUD_URL: 'redis://localhost:6379',
        GIMLI_REDIRECT_URL: 'http://localhost:3000/auth/github/callback'
      }
    }
  });

  // Run tests
  grunt.registerTask('test',    ['env:test', 'jshint', 'mochaTest']);
  grunt.registerTask('ci',      ['watch::test']);
  grunt.registerTask('travis',  ['test', 'coveralls']);

  // How to build
  grunt.registerTask('build',   ['jshint', 'concat', 'copy', 'stylus']);
  grunt.registerTask('heroku:production', ['build']);

  // How to run
  grunt.registerTask('start',   ['env:dev', 'nodemon']);

  // Build and watch
  grunt.registerTask('dev',     ['build', 'watch::dev']);
  grunt.registerTask('default', ['dev']);
};

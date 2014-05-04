module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      server: {
        src: ['src/**/*.js', '!src/public/**'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      server: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.server.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    copy: {
      options: {
        expand: true
      },
      views: {
        files: [
          { expand: true, cwd: 'src/', src: ['views/**'], dest: 'dist' }
        ]
      },
      images: {
        files: [
          { expand: true, cwd: 'src/public', src: ['images/**'], dest: 'dist/public' }
        ]
      },
      vendor: {
        files: [
          { expand: true, src: ['vendor/**'], dest: 'dist/public' }
        ]
      }
    },
    watch: {
      files: ['src/**'],
      tasks: ['jshint', 'build']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'copy']);

  grunt.registerTask('heroku', ['build']);
  grunt.registerTask('default', ['build']);

};

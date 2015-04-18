module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      options: {
        atBegin: true
      },

      stylus: {
        files: 'assets/source/styles/*.styl',
        tasks: ['stylus', 'autoprefixer']
      },
      
      js: {
        files: 'assets/source/scripts/*.js',
        tasks: ['concat', 'uglify']
      }
    },

    stylus: {
      options: {
        compress: false
      },

      compile: {
        files: {
          'assets/css/style.css': ['assets/source/styles/layout.styl']
        }
      }
    },

    concat: {
      js: {
        files: {
          'assets/js/scripts.js': [
            'assets/source/scripts/*.js'
          ]
        }
      }
    },

    autoprefixer: {
      main: {
        files: {
          'assets/css/style.css': 'assets/css/style.css'
        }
      }
    },

    uglify: {
      main: {
        files: {
          'assets/js/scripts.js': 'assets/js/scripts.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['stylus', 'autoprefixer', 'concat', 'uglify']);
};

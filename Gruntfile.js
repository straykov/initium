module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      options: {
        atBegin: true
      },

      stylus: {
        files: 'assets/source/styles/*.styl',
        tasks: ['stylus', 'postcss:dist']
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

    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer-core')({browsers:
            ['last 3 versions', '> 1%', 'IE 8']
          }),
          require('cssnano')()
        ]
      },

      dist: {
        src: 'assets/css/*.css'
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
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['stylus', 'postcss:dist', 'concat', 'uglify']);
};

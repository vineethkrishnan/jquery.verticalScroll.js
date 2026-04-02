module.exports = function(grunt) {

  var baseName = 'jquery.verticalscroll';
  var banner = '/*! <%= pkg.name %> | Vineeth N Krishnan (@way2vineeth) | <%= grunt.template.today("yyyy-mm-dd") %> | MIT Licensed */\n';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    baseName: baseName,

    // Compile SCSS → CSS
    sass: {
      dist: {
        options: {
          implementation: require('sass'),
          sourceMap: true,
          outputStyle: 'expanded'
        },
        files: {
          'src/css/jquery.verticalScroll.css': 'src/scss/main.scss'
        }
      }
    },

    // Minify CSS
    cssmin: {
      dist: {
        options: {
          sourceMap: true,
          banner: banner
        },
        files: {
          'dist/css/<%= baseName %>.min.css': ['src/css/jquery.verticalScroll.css']
        }
      }
    },

    // Minify JS
    uglify: {
      dist: {
        options: {
          sourceMap: true,
          banner: banner
        },
        files: {
          'dist/js/<%= baseName %>.min.js': ['src/js/**/*.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // scss → autoprefix → minify CSS + minify JS
  grunt.registerTask('default', ['sass', 'cssmin', 'uglify']);
  grunt.registerTask('css', ['sass', 'cssmin']);
  grunt.registerTask('js', ['uglify']);
};

module.exports = function(grunt) {

  // Base name without scope for file paths
  var baseName = 'jquery.verticalscroll';

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    baseName: baseName,
    uglify: {
     dist: {
      options: {
       sourceMap: true,
       banner: '/*! <%= pkg.name %> | Vineeth N Krishnan (@way2vineeth) | <%= grunt.template.today("yyyy-mm-dd") %> | MIT Licensed */\n'
     },
     files: {
       'dist/js/<%= baseName %>.min.js': ['src/js/**/*.js'],
     }
   }
 },
 cssmin: {
   dist: {
    options: {
     sourceMap: true,
     banner: '/*! <%= pkg.name %> | Vineeth N Krishnan (@way2vineeth) | <%= grunt.template.today("yyyy-mm-dd") %> | MIT Licensed */\n'
   },
   files: {
     'dist/css/<%= baseName %>.min.css': ['src/css/jquery.verticalScroll.css']
   }
 }
}
});

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['uglify','cssmin']);

};
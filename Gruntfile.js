module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    uglify: {
     dist: {
      options: {
       sourceMap: true,
       banner: '/*! <%= pkg.name %> | Vineeth N Krishnan (@way2vineeth) | <%= grunt.template.today("yyyy-mm-dd") %> | MIT Licensed */\n'
     },
     files: {
       'dist/js/<%= pkg.name %>.min.js': ['src/js/**/*.js'],
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
     'dist/css/<%= pkg.name %>.min.css': ['src/css/<%= pkg.name %>.css']
   }
 }
}
});

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['uglify','cssmin']);

};
'use strict';
module.exports = function(grunt) {


    // Project configuration.
    grunt.initConfig({
        uglify: {
            build: {
                src: 'public/js/*.js',
                dest: 'dist/otbd.min.js'
            }
        },
        concat: {
            js: {
                src: ['public/js/bookmark.js', 'public/js/search.js'],
                dest: 'build/script.js',
            }
        },
        jshint: {
            files: ['Gruntfile.js'],
            options: {
                globals: {
                    jQuery: true,
                },
            },
        },
        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: [],
            },
            js: {
                options: {
                    livereload: true,
                },
                files: ['server.js', 'routes/**/*.js', 'models/**/*.js', 'public/js/**/*.js'],
                tasks: [],
            },
            css: {
                options: {
                    livereload: true,
                },
                files: ['public/css/**/*.css'],
                tasks: [],
            },
            handlebars: {
                options: {
                    livereload: true,
                },
                files: ['views/**/*.handlebars'],
                tasks: []
            }
        },
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-csslint');

    // Default task(s).
    grunt.registerTask('default', ['watch']);
};

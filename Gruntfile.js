module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		config: {
			app: ".",
			dist: "dist"
		},
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= config.dist %>/{,*/}*',
						'!<%= config.dist %>/.git{,*/}*'
					]
        		}]
      		},
		},
      	wiredep: {
			app: {
				src: ['index.html'],
			}
		},
		copy: {
			dist: {
				files: [{
			  		expand: true,
					dot: true,
					cwd: '<%= config.app %>',
					dest: '<%= config.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'*.html',
						'partials/{,*/}*.html',
						'assets/img/{,*/}*.*',
						'assets/{,*/}*.json',
						'assets/{,*/}*.css',
					]
				}]
			}
		},
		useminPrepare: {
			html: 'index.html',
			options: {
				dest: '<%= config.dist %>',
				flow: {
					html: {
						steps: {
							js: ['concat', 'uglifyjs'],
							css: ['concat', 'cssmin']
						},
 						post: {}
          			}
        		}
     		}
    	},
    	filerev: {
			dist: {
				src: [
					'<%= config.dist %>/scripts/{,*/}*.js',
					'<%= config.dist %>/styles/{,*/}*.css',
					'<%= config.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
					'<%= config.dist %>/styles/fonts/*'
				]
			}
		},
		usemin: {
			html: ['<%= config.dist %>/{,*/}*.html'],
			css: ['<%= config.dist %>/styles/{,*/}*.css'],
			options: {
				assetsDirs: [
					'<%= config.dist %>',
					'<%= config.dist %>/images',
					'<%= config.dist %>/styles'
				]
			}
		},
		ngAnnotate: {
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/concat/scripts',
					src: ['*.js', '!oldieshim.js'],
					dest: '.tmp/concat/scripts'
				}]
			}
		},
		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: true,
					conservativeCollapse: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true,
					keepClosingSlash: true
				},
				files: [{
					expand: true,
					cwd: '<%= config.dist %>',
					src: ['*.html', 'partials/{,*/}*.html'],
					dest: '<%= config.dist %>'
				}]
			}
	    },
	    cdnify: {
	    	dist: {
	    		html: ['<%= config.dist %>/*.html']
	    	}
		},
	});

	grunt.registerTask('build', [
		'clean:dist',
		'wiredep',
		'useminPrepare',
		'concat',
		'ngAnnotate',
		'copy:dist',
		'cdnify',
		'cssmin',
		'uglify',
		'filerev',
		'usemin',
		'htmlmin'
	]);

	grunt.registerTask('default', [
   		'build'
   	]);
};
module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		config: {
			app: ".",
			dist: "dist"
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
							js: ['concat'],
							css: ['concat']
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
	});

	grunt.registerTask('build', [
		'wiredep',
		'useminPrepare',
		'concat',
		'filerev',
		'copy:dist',
		'usemin'
	]);

	grunt.registerTask('default', [
   		'build'
   	]);
};
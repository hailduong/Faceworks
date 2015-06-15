angular.module('faceCareerControllers').controller("ResultCtrl", function($rootScope, $scope, $location, $http) {
	$scope.isReady = false;
	$scope.isLoadedAvatar = false;
	$scope.isShowJobResult = false;

	$scope.faceResult = {
		status: 'Status_Loading'
	};

	if (typeof(FB) != "undefined") {
		FB.api(
			"/me", 
			function (response) {
				if (response && !response.error) {
					console.log(response);
					$scope.faceResult.name = response.first_name + " " + response.last_name;

				}
			}
		);
	}

	var selectedJob = 0;
	var jobs = null;
	var loadJobList = function(callback) {
		$http.get('assets/job.json').success(function (data) {
	        var fbid = $rootScope.fbID + '';
	        var number = '';
	        for (var i = fbid.length - 1; i >= 0 && number.length < 4; i--) {
	        	if (fbid[i] >= '0' && fbid[i] <= '9') {
	        		number += fbid[i];
	        	}
	        }
	        number = parseInt(number);
	        selectedJob = number % data.length;
	        jobs = data;
	        if (callback) {callback();}
	    });
	}

	var loadFacebookAvatar = function(url) {
		var size = 200;

		var img = new Image, 
			canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d");

		img.crossOrigin = "Anonymous";
		img.width = size;
		img.height = size;
		img.src = url;

		img.onload = function() {
			canvas.width = size;
			canvas.height = size;
			ctx.drawImage( img, 0, 0);

			setTimeout(function() {
				var img2 = new Image;
				img2.crossOrigin = "Anonymous";
				img2.src = canvas.toDataURL();
				img2.setAttribute("id", "avatar_img");

				$scope.isLoadedAvatar = true;
				$scope.faceResult.status = 'Status_Scanning';
				$scope.$apply(function() {
					$("#avatar").prepend(img2);
				});

				setTimeout(function(){
					var tracker = new tracking.ObjectTracker(['face']);
					tracker.setStepSize(1.7);
					tracking.track('#avatar_img', tracker);
					
					tracker.on('track', function(event) {
						console.log(event);

						$scope.faceResult.status = 'Status_Checking';
						$scope.$apply();

						event.data.forEach(function(rect) {
							$("#marker").addClass("face-detection-ring");
							$("#marker").css({ 
								top: (rect.y + 10) + "px",
								left: (rect.x + 10) + "px",
								width: rect.width + "px",
								height: rect.height + "px",
								display: "block",
								position: "relative"
							});

						});

						setTimeout(function(){
							$scope.faceResult.status = null;
							$scope.faceResult.job = jobs[selectedJob];
							$scope.$apply();
						}, 2000);
					});
				}, 1000);
			}, 500);
		}
	}


	if (!$rootScope.fbID) {
		$location.url("/");
		return;
	} else {
		$scope.userAvatar = "http://graph.facebook.com/" + $rootScope.fbID + "/picture?type=large";
		$scope.isReady = true;
		loadJobList(loadFacebookAvatar($scope.userAvatar));
	}

	$scope.backHome = function() {
		$location.url('/');
	}

	$scope.onRegister = function() {

	}
});
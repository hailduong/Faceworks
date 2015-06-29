// Init this Controller Module
var faceCareerControllers = angular.module('faceCareerControllers', []);

// Services
faceCareerControllers.factory('sharedResultService', function () {
    return {
        sharedResult: 11,
        numberOfItem: 23
    };
});

// Controller
faceCareerControllers.controller('sampleFaceCtrl', function ($scope, $http, $location, sharedResultService, $translate) {
    'use strict';
    $http.get('assets/face_sample.json').success(function (data) {
        $scope.sampleFaces = data;
        $scope.numberOfSampleFaces = data.length;
        $scope.activeImage = sharedResultService.sharedResult;
        $scope.carouselPosition = ( 11 - sharedResultService.sharedResult) * 200 + 100;
        $scope.carouselWidth = ($scope.numberOfSampleFaces) * 200 + 22 + "px";
        var carouselWidth = $('.sample-faces').width();
        $scope.carouselWrapperPosition = (carouselWidth - (($scope.numberOfSampleFaces) * 200 + 20 )) / 2;
        $(window).resize(function () {
            carouselWidth = $('.sample-faces').width();
            $scope.carouselWrapperPosition = (carouselWidth - (($scope.numberOfSampleFaces) * 200 + 20 )) / 2;
        })
    });


    $scope.setFaceActive = function ($index) {
        if ($index === $scope.activeImage) {
            $location.url('/result?id=' + $index);
        } else {
            var oldPosition = $scope.activeImage;
            $scope.activeImage = $index;
            $scope.carouselPosition = $scope.carouselPosition + (oldPosition - $scope.activeImage ) * 200;
        }
    };

    $scope.srollActiveFaceDown = function () {
        if ($scope.activeImage < ($scope.numberOfSampleFaces - 1)) {
            $scope.activeImage++;
            $scope.carouselPosition = $scope.carouselPosition - 200;
        }

    };

    $scope.srollActiveFaceUp = function () {
        if ($scope.activeImage > 0) {
            $scope.activeImage--;
            $scope.carouselPosition = $scope.carouselPosition + 200;
        }
    };

    $(function () {
        $('body').keyup(function (e) {
            if ($location.path() === "/") {
                if (e.keyCode === 13) {
                    $scope.$apply(function () {
                        $location.url('/result?id=' + $scope.activeImage);
                    });
                }
                if (e.keyCode === 39) {
                    $scope.$apply(function () {
                        $scope.srollActiveFaceDown();
                    });

                }
                if (e.keyCode === 37) {
                    $scope.$apply(function () {
                        $scope.srollActiveFaceUp();
                    });

                }
            } else {
                if (e.keyCode === 27) {
                    $scope.$apply(function () {
                        $location.url('/');
                    });
                }
            }
        })
    })
});

faceCareerControllers.controller('resultCtrl', function ($scope, $rootScope, $http, $location, sharedResultService) {
    $http.get('assets/face_sample.json').success(function (data) {
        sharedResultService.sharedResult = parseInt($location.search().id, 10);
        sharedResultService.numberOfItem = data.length;
        for (i = 0; i < data.length; i++) {
            if (i === sharedResultService.sharedResult) {
                $scope.faceResult = data[i];
            }
        }

        $scope.$watch(function () {
            return sharedResultService.sharedResult;
        }, function () {
            $location.url('/result?id=' + sharedResultService.sharedResult);
        });
    });


    $scope.backHome = function () {
        $location.url('/');
    };

    $scope.isLoginFb = false;

    $scope.onLoginWithFacebook = function () {
        $scope.isLoginFb = true;
        FB.login(function (response) {
            if (response.status === 'connected') {
                $rootScope.fbID = response.authResponse.userID;
                $location.url("/resultfb");
                $scope.$apply();
            } else if (response.status === 'not_authorized') {
                // console.log("fail to login with facebbok", "not_authorized");
                $scope.isLoading = false;
                $scope.$apply();
            } else {
                // console.log("fail to login with facebbok");
                $scope.isLoading = false;
                $scope.$apply();
            }
        }, {scope: 'public_profile,email'});
    };

    $scope.onFacebookStatusCallback = function (status) {
        $scope.isLoginFb = true;
    };

    $(function () {
        $('body').keyup(function (e) {
            if ($location.path() !== "/") {
                if (e.keyCode === 27) {
                    $scope.$apply(function () {
                        $scope.backHome();
                    });
                }
            }
        });
    });

});

faceCareerControllers.directive('ngMouseWheelUp', function () {
    return function (scope, element, attrs) {
        element.bind("DOMMouseScroll mousewheel onmousewheel", function (event) {

            // cross-browser wheel delta
            var event = window.event || event; // old IE support
            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

            if (delta > 0) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngMouseWheelUp);
                });

                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if (event.preventDefault) {
                    event.preventDefault();
                }

            }
        });
    };
});

faceCareerControllers.directive('ngMouseWheelDown', function () {
    return function (scope, element, attrs) {
        element.bind("DOMMouseScroll mousewheel onmousewheel", function (event) {

            // cross-browser wheel delta
            var event = window.event || event; // old IE support
            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

            if (delta < 0) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngMouseWheelDown);
                });

                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if (event.preventDefault) {
                    event.preventDefault();
                }

            }
        });
    };
});

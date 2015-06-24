angular.module('faceCareerControllers').controller('HomeCtrl', function ($rootScope, $scope, $location) {
    $scope.isLoginFb = false;

    $scope.onLoginWithFacebook = function () {
        $scope.isLoginFb = true;
        FB.login(function (response) {
            if (response.status === 'connected') {
                $rootScope.fbID = response.authResponse.userID;
                $location.url("/resultfb");
                $scope.$apply();
            } else if (response.status === 'not_authorized') {
                console.log("fail to login with facebbok", "not_authorized");
                $scope.isLoading = false;
                $scope.$apply();
            } else {
                console.log("fail to login with facebbok");
                $scope.isLoading = false;
                $scope.$apply();
            }
        }, {scope: 'public_profile,email'});
    };

    $scope.onFacebookStatusCallback = function (status) {
        $scope.isLoginFb = true;
    };
});
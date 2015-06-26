// Setup Face Career with dependencies
var faceCareer = angular.module('faceCareer', [
    'ngRoute',
    'faceCareerControllers',
    'ngTouch',
    'pascalprecht.translate',
    'ngCookies'
]);

// Configure Route
faceCareer.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/home.html',
            controller: 'sampleFaceCtrl'
        }).when('/result', {
            templateUrl: 'partials/result.html',
            controller: 'resultCtrl'
        }).when('/resultfb', {
            templateUrl: 'partials/result_fb.html'
        }).otherwise({redirectTo: '/'});
    }]);


// Configure Translation
var translationsEN = {
    WhichJobDoILook: 'Which Job Do I Look?',
    Privacy: 'Privacy',
    TermsOfUse: 'Terms of Use',
    PrivacyUrl: 'http://www.vietnamworks.com/privacy-policy',
    TermsOfUseUrl: 'http://www.vietnamworks.com/terms-of-use',
    UseFBProfile: 'Use Your Facebook Profile',
    PS: 'P.S. We do not keep any photo!',
    Hello: 'Hello',
    MyNameIs: 'My name is',
    Sorry: 'Sorry if we did not get your job right! <br/> You can tell us about your job, and we will keep you updated with best jobs.',
    EmailMe: 'Email Me Jobs',
    EmailMeUrl: 'http://www.vietnamworks.com/jobalert',
    YouLookLike: 'You look like a',

    Status_Loading: 'Loading ...',
    Status_Scanning: 'Scanning ...',
    Status_Checking: 'Checking your job ...',
    Processing: 'Processing ...',
    ShareResult: 'Share Result'
};

var translationsVI = {
    WhichJobDoILook: 'Trông Bạn Hợp Với Nghề Nào?',
    Privacy: 'Quy Định Bảo Mật',
    TermsOfUse: 'Thỏa Thuận Sử Dụng',
    PrivacyUrl: 'http://www.vietnamworks.com/quy-dinh-bao-mat',
    TermsOfUseUrl: 'http://www.vietnamworks.com/thoa-thuan-su-dung',
    UseFBProfile: 'Sử Dụng Hồ Sơ Facebook',
    PS: 'P.S. Chúng tôi không lưu giữ bất cứ hình ảnh nào!',
    Hello: 'Xin chào',
    MyNameIs: 'Tên tôi là',
    Sorry: 'Rất tiếc nếu chúng tôi đoán không đúng công việc của bạn! <br/> Hãy cho chúng tôi biết bạn làm gì, chúng tôi sẽ giúp bạn cập nhật những công việc tốt nhất.',
    EmailMe: 'Gửi Việc Cho Tôi',
    EmailMeUrl: 'http://www.vietnamworks.com/tao-thong-bao-viec-lam',
    YouLookLike: 'Bạn trông giống như',

    Status_Loading: 'Đang tải ...',
    Status_Scanning: 'Đang quét ...',
    Status_Checking: 'Đang dự đoán ...',
    Processing: 'Đang gửi ...',
    ShareResult: 'Chia sẻ kết quả'
};

faceCareer.config(['$translateProvider', function ($transProvider) {
    $transProvider.translations('en', translationsEN);
    $transProvider.translations('vi', translationsVI);
    $transProvider.preferredLanguage('en');
    $transProvider.fallbackLanguage('en');
    $transProvider.useCookieStorage();
}]);


faceCareer.controller('MainControl', ['$translate', '$scope', function ($translate, $scope) {


    $scope.activatedLanguage = function () {
        if ($translate.use() === "en") {
            return 'en';
        } else {
            return 'vi';
        }
    }();

    $scope.changeLanguage = function (languageKey) {
        $translate.use(languageKey);
        if (languageKey === "en") {
            $scope.activatedLanguage = 'en';
        } else {
            $scope.activatedLanguage = 'vi';
        }
    }
}]);
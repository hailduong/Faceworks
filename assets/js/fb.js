
window.fbAsyncInit = function() {
	FB.init({
		appId      : '385501214972613',
		cookie     : true,
		xfbml      : true,
		version    : 'v2.3'
	});

	FB.getLoginStatus(function(response) {
		console.log('statusChangeCallback');
		console.log(response);

		var scope = angular.element(document.getElementById("home_page")).scope();
		scope.$apply(function() {
			scope.onFacebookStatusCallback(response.status);
		});
	});

};

// Load the SDK asynchronously
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=385501214972613";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


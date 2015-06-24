<?php
require 'vendor/autoload.php';

$app = new \Slim\Slim();
$apiKey     = '2ed19d9c84fa9280fe6fa1a9e58de807a9d076646de8327c53fc8ed64ca4e268';
$apiHost    = 'https://api-staging.vietnamworks.com';

function TestAccount($email, $first_name, $last_name, $onsuccess, $onerror) {
	global $apiKey, $apiHost;
	$apiPath    = '/users/account-status/?email=' . $email;

	$ch = curl_init();
	curl_setopt_array($ch, array(
		CURLOPT_URL             => $apiHost.$apiPath,
		CURLOPT_RETURNTRANSFER  => true,
		CURLOPT_SSL_VERIFYPEER  => false, // ignore SSL verification
		CURLOPT_HTTPHEADER      => array(
			"CONTENT-MD5: $apiKey",
			'Content-Type: application/json',
		),
	));
	$response = curl_exec($ch);
	$responseArray = (array)json_decode($response, true);
	curl_close($ch);

	if ($responseArray['meta']['code'] == 400) { // error happened
		$onerror();
	} elseif ($responseArray['meta']['code'] == 200)  {
		$onsuccess($email, $first_name, $last_name, $responseArray['data']['accountStatus']);
	} else {
		$onerror();
	}
}

function Register($email, $first_name, $last_name) {
	global $apiKey, $apiHost;

	$apiPath    = '/users/registerWithoutConfirm';

	$jsonString = json_encode(array(
	    'email' => $email,
	    'firstname' => $first_name,
	    'lastname' => $last_name
	));

	$ch = curl_init();
	curl_setopt_array($ch, array(
		CURLOPT_URL             => $apiHost.$apiPath,
		CURLOPT_RETURNTRANSFER  => true,
		CURLOPT_SSL_VERIFYPEER  => false, // ignore SSL verification
		CURLOPT_POST            => true,  // http request method is POST
		CURLOPT_HTTPHEADER      => array(
			"CONTENT-MD5: $apiKey",
			'Content-Type: application/json',
			'Content-Length: '.strlen($jsonString)
		),
		CURLOPT_POSTFIELDS      => $jsonString
	));
	$response = curl_exec($ch);
	$responseArray = (array)json_decode($response, true);
	curl_close($ch);

	if ($responseArray['meta']['code'] == 400) { // error happened
		return array('error' => 1, 'message' => $responseArray['meta']['message']);
	} elseif ($responseArray['meta']['code'] == 200)  {
		return array('error' => 0, 'message' => $responseArray['meta']['message']);
	} else {
		//unknown error
		$info = curl_getinfo($ch);
		return array('error' => 1, 'message' => "An error happened: \n".curl_error($ch)."\nInformation: ".print_r($info, true)."\nResponse: $response");
	}
	
}

$app->post('/vnw_register', function () {
	try {
		$app = \Slim\Slim::getInstance();
		$request = $app->request();
		$app->response()->header('Content-Type', 'application/json');

		$data = json_decode($request->getBody(), true);

		TestAccount($data['email'], $data['first_name'], $data['last_name'], function($email, $first_name, $last_name, $status) {
			if ($status == "NEW") {
				echo json_encode(Register($email, $first_name, $last_name));
			} else {
				echo json_encode(array('error' => 0, 'message' => 'success'));
			}
			
		}, function() {
			echo json_encode(array('error' => 1, 'message' => 'Failed to call the REST api on VietnamWorks'));
		});
		
	}
	catch (Exception $e) {
		echo json_encode(array('error' => 1, 'message' => $e->getMessage()));
    }
});
$app->run();
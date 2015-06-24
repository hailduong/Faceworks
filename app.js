var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var curl = require("curlrequest");


app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({
	extended: true
})); 

app.get('/', function (req, res) {
  res.redirect("index.html");
});

app.post('/vnw_register', function (req, res) {
	var email = req.body.email;
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	
	var opt1 = {
		url: 'https://api-staging.vietnamworks.com/users/account-status/?email=' + email, 
		headers: {
			'Content-Type': 'application/json',
			'Accept': "application/json",
			'content-md5': '2ed19d9c84fa9280fe6fa1a9e58de807a9d076646de8327c53fc8ed64ca4e268'
		}
	};

	var opt2 = {
		url: 'https://api-staging.vietnamworks.com/users/registerWithoutConfirm', 
		headers: {
			'Content-Type': 'application/json',
			'Accept': "application/json",
			'content-md5': '2ed19d9c84fa9280fe6fa1a9e58de807a9d076646de8327c53fc8ed64ca4e268'
		},
		data: JSON.stringify({
			"email": email,
			"firstname": first_name,
			"lastname": last_name
		}),
		method: "POST"
	};

	curl.request(opt1, function (err, data) {
		var d = {}
		try {
			d = JSON.parse(data);
		} catch (e1) {}
		if (d && d.meta && d.meta.code === 200 && d.data) {
			if (d.data.accountStatus === "NEW") {
				curl.request(opt2, function (err, data2) {
					var d2 = {}
					try {
						d2 = JSON.parse(data2);
					} catch (e2) {}
					if (d2 && d2.meta && d2.meta.code === 200 && d2.data) {
					} else {
						if (d2 && d2.meta && d2.meta.message) {
							res.send({error:0, message: d2.meta.message});
						} else {
							res.send({error:1, message: "Failed to call the REST api on VietnamWorks"});
						}
					}
				});
			} else {
				res.send({error:0});
			}
		}
		else {
			if (d && d.meta && d.meta.message) {
				res.send({error:1, message: d.meta.message});
			} else {
				res.send({error:1, message: "Failed to call the REST api on VietnamWorks"});
			}
		}
	});
});

app.use(express.static('./'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
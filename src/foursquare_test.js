var sys = require('sys'),
	express = require('express'),
	assert = require('assert');

var FOURSQ = require('./foursquare'),
	KEYS = require('./key');


var CLIENT_ID = KEYS.CLIENT_ID;
var CLIENT_SECRET = KEYS.CLIENT_SECRET;
var REDIRECT_URI = "http://distancebodza.com:30000/callback";


// Test functions

function testUserSearch(access_token) {

	var query = { twitter: "naveen" };

	FOURSQ.searchUsers(query, access_token, function (data) {

		var result = data[0].id;

		try {
			assert.equal(result, '33');
			console.log("-> searchUser OK");
		} catch (e) {
			console.log("-> searchUser ERROR");
		}

	}, function (error) {
		console.log("-> searchUser ERROR");
	});
}

function testVenueSearch(access_token) {

	var query = { ll: "40.7, -74" };

	FOURSQ.searchVenues(query, access_token, function (data) {

		var result = data[0].type;

		try {
			assert.equal(result, 'nearby');
			console.log("-> searchVenue OK");
		} catch (e) {
			console.log("-> searchVenue ERROR");
		}

	}, function (error) {
		console.log(error);
		console.log("-> searchVenue ERROR");
	});
}

function testTipSearch(access_token) {

	var query = { ll: "40.7, -74" };

	FOURSQ.searchTips(query, access_token, function (data) {

		var result = data[0].text;

		try {
			assert.equal(result, 'It is time for espresso');
			console.log("-> searchTips OK");
		} catch (e) {
			console.log("-> searchTips ERROR");
		}

	}, function (error) {
		console.log(error);
		console.log("-> searchTips ERROR");
	});
}


function testGetRecentCheckins(access_token) {

	FOURSQ.getRecentCheckins( { limit: "20" }, access_token, function (data) {

		var result = JSON.stringify(data);

		try {
			assert.ok(result);
			console.log("-> getRecentCheckins OK");
		} catch (e) {
			console.log("-> getRecentCheckins ERROR");
		}

	}, function (error) {
		console.log("-> getRecentCheckins ERROR");
	});
}

function testGetSettings(access_token) {

	FOURSQ.getSettings( access_token, function (data) {

		var result = JSON.stringify(data);

		try {
			assert.ok(result);
			console.log("-> getSettings OK");
		} catch (e) {
			console.log("-> getSettings ERROR");
		}

	}, function (error) {
		console.log("-> getSettings ERROR");
	});
}


function testGetPhoto(access_token) {

	FOURSQ.getPhoto("4d0fb8162d39a340637dc42b", access_token, function (data) {
		var result = data.id;

		try {
			assert.equal(result, "4d0fb8162d39a340637dc42b");
			console.log("-> getPhoto OK");
		} catch (e) {
			console.log("-> getPhoto ERROR");
		}

	}, function (error) {
		console.log("-> getPhoto ERROR");
	});
}

function testGetUser(access_token) {

	FOURSQ.getUser("self", access_token, function (data) {
		var result = data;

		try {
			assert.ok(result);
			console.log("-> getUser OK");
		} catch (e) {
			console.log("-> getUser ERROR");
		}

	}, function (error) {
		console.log("-> getUser ERROR");
	});
}

function testGetVenue(access_token) {

	FOURSQ.getVenue(5104, access_token, function (data) {
		var result = data.id;

		try {
			assert.equal(result, "40a55d80f964a52020f31ee3");
			console.log("-> getVenue OK");
		} catch (e) {
			console.log("-> getVenue ERROR");
		}

	}, function (error) {
		console.log("-> getVenue ERROR");
	});
}

function testGetCheckin(access_token) {

	FOURSQ.getCheckin("IHR8THISVNU", access_token, function (data) {
		var result = data;

		try {
			assert.ok(result);
			console.log("-> getCheckin OK");
		} catch (e) {
			console.log("-> getCheckin ERROR");
		}

	}, function (error) {
		console.log("-> getCheckin ERROR");
	});
}

function testGetTip(access_token) {

	FOURSQ.getTip("4b5e662a70c603bba7d790b4", access_token, function (data) {
		var result = data.id;

		try {
			assert.equal(result, "4b5e662a70c603bba7d790b4");
			console.log("-> getTip OK");
		} catch (e) {
			console.log("-> getTip ERROR");
		}

	}, function (error) {
		console.log("-> getTip ERROR");
	});
}



var app = express.createServer();

app.get('/login', function(req, res) {

	var loc = "https://foursquare.com/oauth2/authenticate?client_id=" + CLIENT_ID + "&response_type=code&redirect_uri=" + REDIRECT_URI;
	res.writeHead(303, { 'location': loc });
	res.end();
});

app.get('/callback', function (req, res) {

	var code = req.query.code;

	FOURSQ.getAccessToken({
		code: code,
		redirect_uri: REDIRECT_URI,
		client_id: CLIENT_ID,
		client_secret: CLIENT_SECRET
	}, function (access_token) {

		if (access_token !== undefined) {

			testTipSearch(access_token);
			testUserSearch(access_token);
			testVenueSearch(access_token);

			testGetRecentCheckins(access_token);
			testGetSettings(access_token);
			testGetPhoto(access_token);

			testGetUser(access_token);
			testGetVenue(access_token);

			testGetCheckin(access_token);
			testGetTip(access_token);

			res.send('Please check the console.');

		} else {
			console.log("access_token is undefined.");
		}

	});
});

app.get('/', function(req, res){
    res.send('Hello Foursquare');
});


app.listen(30000);
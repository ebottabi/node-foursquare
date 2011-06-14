node-foursquare
==================

Fault-tolerant Foursquare API wrapper for Node JS.


Install
-------

    npm install node-foursquare

Version History
---------------

*  v0.0.1 - First release
*  v0.0.2 - Bug Fixes and Downstream Merges
*  v0.1.0 - Suggested Refactoring and latest endpoints from Foursquare (VERY NON-PASSIVE)
    * Surround results with field name.
    * Userless Access Tokens (for Venues.explore, etc).
    * Ability to load single portions of the library, (e.g. only import Venues).
    * Users - Leaderboard, Requests
    * Venues - Categories, Explore


Use
---

The Foursquare module takes a configuration parameter containing logging and client keys. It also supports alternate
Foursquare URLs if necessary, (but that is unlikely).

    var config = {
      "secrets" : {
        "clientId" : "CLIENT_ID",
        "clientSecret" : "CLIENT_SECRET",
        "redirectUrl" : "REDIRECT_URL"
      }
    }

    var foursquare = require("node-foursquare").Foursquare(config);

Once instantiated, you just need to set up the correct endpoints on your own server that match your OAuth configuration
in Foursquare.  Using express, for example:

    var app = express.createServer();

    app.get('/login', function(req, res) {
      var url = Foursquare.getAuthClientRedirectUrl();
      res.writeHead(303, { "location": url });
      res.end();
    });


    app.get('/callback', function (req, res) {
      var code = req.query.code;

      Foursquare.getAccessToken({
        code: code
      }, function (error, accessToken) {
        if(error) {
          res.send("An error was thrown: " + error.message);
        }
        else {
          // Save the accessToken and redirect.
        }
      });
    });

All methods within the module require the Access Token from the callback.

For more details and examples, take a look at the test oracle in the /test directory.

Logging
-------

This module uses Log4js to log events. By default, everything is set to "OFF". If you want to output logging messages
from the different modules of this library, you can add overrides to your configuration object.  For example, to log
INFO (and higher) messages in Venues:

    var config = {
      "log4js" : {
        "appenders" : [{
          "type" : "console"
        }],
        "levels" : {
          "node-foursquare.Venues" : "INFO"
        }
      },
      "secrets" : {
        "clientId" : "CLIENT_ID",
        "clientSecret" : "CLIENT_SECRET",
        "redirectUrl" : "REDIRECT_URL"
      }
    }

    var foursquare = require("node-foursquare").Foursquare(config);

For a list of existing logging points, refer to [https://github.com/clintandrewhall/node-foursquare/blob/master/lib/config-default.js](config-default.js).

For more information, visit: https://github.com/csausdev/log4js-node

Testing
-------

To test, you need to create a config.js file in the /test directory as follows:

    exports.config = {
      "secrets" : {
        "clientId" : [YOUR_CLIENT_ID],
        "clientSecret" : [YOUR_CLIENT_SECRET],
        "redirectUrl" : "http://localhost:3000/callback" // This should also be set in your OAuth profile.
      }
    };

Then, simply invoke the test.js file with Node.JS:

    node test.js

If you hit [http://localhost:3000/test](http://localhost:3000/test), you'll test the entire library with no authentication, (and get appropriate
errors for protected endpoints.

If you hit [http://localhost:3000](http://localhost:3000), you'll be redirected for an authentication token.

Testing results will be logged to the console.

Documentation
-------------

Detailed documentation is available in the /docs directory.

Notes
-----

This module is a read-only subset of the full Foursquare API, but further capability, (adding, posting, updating, etc),
is forthcoming. Bugs and Pull Requests are, of course, accepted! :-)

This project is a refactoring and enhancement of: https://github.com/yikulju/Foursquare-on-node
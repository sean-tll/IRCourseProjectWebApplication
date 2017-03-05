"use strict";

var Twitter = require("node-twitter-api"),
    secret = require( 'secret' ),
    path = require("path");

module.exports = function(app) {
    var twitter = new Twitter({
      consumerKey: "jl4fX4tqUt7AHlFWqV3ws2rtr",
    	consumerSecret: '4xdGpeno82DqDMKhBzziay95MWp7vST2FXURGTEy7cMIpWvXzl',
    	callback: "http://0.0.0.0:3000/"
    });

    var _requestSecret;

    app.get("/request-token", function(req, res) {
        twitter.getRequestToken(function(err, requestToken, requestSecret) {
            if (err)
                res.status(500).send(err);
            else {
                _requestSecret = requestSecret;
                res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
            }
        });
    });

    app.get('/', function(req, res) {
     res.sendFile(pt('client/app/index.html'));
    });

    app.get('/index', function(req, res) {
     res.sendFile(pt('client/app/index.html'));
    });

    app.get('/homeline', function(req, res) {
     res.sendFile(pt('client/app/homeline.html'));
    });

};

function pt(relative) {
  return path.resolve(__dirname, '../..', relative);
}

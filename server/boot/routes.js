"use strict";

var Twitter = require("node-twitter-api"),
    secret = require( 'secret' ),
    path = require("path"),
    mongoose = require('mongoose');

module.exports = function(app) {
    var twitter = new Twitter({
      consumerKey: "jl4fX4tqUt7AHlFWqV3ws2rtr",
    	consumerSecret: '4xdGpeno82DqDMKhBzziay95MWp7vST2FXURGTEy7cMIpWvXzl',
    	callback: "http://0.0.0.0:3000/access-token"
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

    app.get("/access-token", function(req, res) {
      var requestToken = req.query.oauth_token,
      verifier = req.query.oauth_verifier;

      twitter.getAccessToken(requestToken, _requestSecret, verifier, function(err, accessToken, accessSecret) {
        if (err)
          res.status(500).send(err);
        else {
          mongoose.connection.close();
          mongoose.connect('mongodb://127.0.0.1:27017');
          var Schema = mongoose.Schema;
          var OauthSchema = new Schema({
            accessToken : String,
            accessSecret : String
          });

          // test whether the model exists before registering it
          let Oauth
          try {
            Oauth = mongoose.model('users');
          } catch (error) {
            Oauth = mongoose.model('users', OauthSchema);
          }


          Oauth.remove({}, function(err) {
            if (err) {
              console.log(err);
            }
          });

          twitter.verifyCredentials(accessToken, accessSecret, function(err, user) {
            if (err)
              res.status(500).send(err);
            else {
              var content = new Oauth({
                accessToken : accessToken,
                accessSecret : accessSecret
              });
              content.save(function (err, data) {
                if (err) console.log(err);
                else {
                  // console.log('Saved : ', data );
                  mongoose.connection.close();
                }
              });

              res.sendFile(pt('client/app/logout.html'));
            }

          });
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

    app.get('/logout', function(req, res) {
      mongoose.connection.close();
      mongoose.connect('mongodb://127.0.0.1:27017');
      var Schema = mongoose.Schema;
      var OauthSchema = new Schema({
        accessToken : String,
        accessSecret : String
      });

      let Oauth
      try {
        Oauth = mongoose.model('users');
      } catch (error) {
        Oauth = mongoose.model('users', OauthSchema);
      }
      Oauth.remove({}, function(err) {
        if (err) {
          console.log(err);
        }
        mongoose.connection.close();
      });

      res.sendFile(pt('client/app/index.html'));
    });

};

function pt(relative) {
  return path.resolve(__dirname, '../..', relative);
}

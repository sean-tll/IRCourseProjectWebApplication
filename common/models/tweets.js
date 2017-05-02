'use strict';

var mongoose = require('mongoose');
var PythonShell = require('python-shell');


module.exports = function(Tweets) {

  Tweets.getTweets = function(cb) {
    Tweets.destroyAll(function(error, info) {
      if(error) throw error;
      console.log(info);
    });

    mongoose.connection.close();
    mongoose.connect('mongodb://127.0.0.1:27017');
    var connection = mongoose.connection;
    connection.on('error', console.error.bind(console, 'connection error:'));
    connection.once('open', function () {
      connection.db.collection("users", function(err, collection){
        collection.find({}).toArray(function(err, data){
          var accessToken = data[0].accessToken;
          var accessSecret = data[0].accessSecret;
          mongoose.connection.close();
          var Twitter = require('twitter');
          var client = new Twitter({
            consumer_key: 'jl4fX4tqUt7AHlFWqV3ws2rtr',
            consumer_secret: '4xdGpeno82DqDMKhBzziay95MWp7vST2FXURGTEy7cMIpWvXzl',
            access_token_key: accessToken,
            access_token_secret: accessSecret
          });

          var res = [];
          client.get('statuses/home_timeline', {count : 100}, function(error, tweets, response) {
            if(error) {
              console.log(error);
              throw error;
            }
            //console.log(tweets);
            res = tweets;
            Tweets.storeTweets(tweets);
            cb(null, res);
          });
        })
      });
    });

  };

  Tweets.getTweetsByCategory = function(category, cb) {

    var MongoClient = require('mongodb').MongoClient
      , assert = require('assert');
    console.log(category);
    // Connection URL
    var url = 'mongodb://127.0.0.1:27017/admin';
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
      if(err) throw err;
      var collection = db.collection('Categories');
      collection.find().toArray(function(err, docs) {
        if(err) throw err;
        console.log(docs[0][category]);
        cb(null, docs[0][category]);
      });
    });

  };

  Tweets.remoteMethod(
    'getTweets', {
      http: {
        path: '/getTweets',
        verb: 'get'
      },
      returns: {
        arg: 'tweets',
        type: Object
      }
    }
  );

  Tweets.remoteMethod(
    'getTweetsByCategory', {
      http: {path: '/getTweetsByCategory', verb: 'get'},
      accepts: {arg: 'category', type: 'string', http: { source: 'query' } },
      returns: {arg: 'tweets', type: Array}
    }
  );

  Tweets.storeTweets = function(tweets) {
    var length = tweets.length;
    var i;
    for (i = 0; i < length; i++) {
      var content = {
        "tweet_id": tweets[i].id_str,
        "tweet_content": tweets[i]
      };
      //console.log(content);
      Tweets.create(content,function(error, info) {
        if (error) throw error;
        //console.log(info);
      });
    }
    PythonShell.run('./llda_classifier/mongo_connector.py', function (err) {
      if (err) throw err;
      console.log('finished');
    });
  };

};

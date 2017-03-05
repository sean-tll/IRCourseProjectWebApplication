'use strict';

module.exports = function(Tweets) {

  Tweets.getTweets = function(cb) {
    Tweets.destroyAll(function(error, info) {
      if(error) throw error;
      console.log(info);
    });

    var Twitter = require('twitter');
    var client = new Twitter({
      consumer_key: 'jl4fX4tqUt7AHlFWqV3ws2rtr',
      consumer_secret: '4xdGpeno82DqDMKhBzziay95MWp7vST2FXURGTEy7cMIpWvXzl',
      access_token_key: '412759714-aQFvDDSJ9AkIRqemAOE0SaowZDGzfYStYBc36F2z',
      access_token_secret: 'w2iwqkQJSYU8hu8IsYFxGky72nphERoTb9yCfqprBo8Lf'
    });

    var res = [];
    client.get('statuses/home_timeline', {count : 50}, function(error, tweets, response) {
      if(error) {
        console.log(error);
        throw error;
      }
      //console.log(tweets);
      res = tweets;
      Tweets.storeTweets(tweets);
      cb(null, res);
    });
  };

  Tweets.getTweetsByCategory = function(tweet_id, cb) {
    Tweets.findById(tweet_id, function (error, instance) {
        var response = instance;
        cb(null, response);
        console.log(response);
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
      returns: {arg: 'tweets', type: Object}
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
  };

};

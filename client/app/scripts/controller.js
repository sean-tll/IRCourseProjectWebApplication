'use strict';

angular.module('tweetApp')
  .controller('TweetsController', ['$scope', 'TweetsFactory', function($scope, TweetsFactory) {

    TweetsFactory.getTweets().get(
      function(response) {
        //console.log(response.tweets);
        $scope.tweets = response.tweets;
        // $scope.tweetsIds = [];
        // extractTweetsIds($scope.tweets, $scope.tweetsIds);
        //console.log($scope.tweetsIds);
      },
      function(response){
        console.log(response);
        $scope.tweets = [];
        console.log("server not found");
      }
    );

    function extractTweetsIds(tweets, tweetsIds) {
      var length = tweets.length;
      var i;
      for (i = 0; i < length; i++) {
        tweetsIds.push(tweets[i].id_str);
      }
      //console.log(tweetsIds);
    }

}]);

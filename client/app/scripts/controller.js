'use strict';

angular.module('tweetApp')
  .controller('TweetsController', ['$scope', 'TweetsFactory', function($scope, TweetsFactory) {

    $scope.labels = ['us', 'entertainment', 'sport', 'health', 'sci_tech', 'world', 'business'];

    $scope.tags = ['Local', 'Entertainment', 'Sport', 'Health', 'Science & Technology', 'World', 'Business'];
    $scope.all = true;

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

    $scope.labeledTweets = [];

    $scope.showAllTweets = function() {
      $scope.all = true;
    }

    $scope.showTweetsByCategory = function(tag) {
      $scope.all = false;
      TweetsFactory.getTweetsByCategory($scope.labels[$scope.tags.indexOf(tag)]).get(
        function(response) {
          // console.log(response);
          $scope.labeledTweets = response.tweets;
          // console.log($scope.labeledTweets);
        },
        function(response){
          console.log(response);
          $scope.tweets = [];
          console.log("server not found");
        }
      );
    }



    function extractTweetsIds(tweets, tweetsIds) {
      var length = tweets.length;
      var i;
      for (i = 0; i < length; i++) {
        tweetsIds.push(tweets[i].id_str);
      }
      //console.log(tweetsIds);
    }

}]);

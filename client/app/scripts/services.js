'use strict';

angular.module('tweetApp').constant("baseURL","http://0.0.0.0:3000/api/Tweets/")
  .service('TweetsFactory', ['$resource', 'baseURL', function($resource, baseURL){

    this.getTweets = function(){
      //console.log($resource(baseURL+"getTweets", null,  {'update':{method:'Get' }}));
      return $resource(baseURL+"getTweets", null,  {'query':{method:'Get', isArray:true}});
    };

}]);

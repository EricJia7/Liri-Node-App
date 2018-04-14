
require("dotenv").config();

var moment = require('moment');

const listOfKeys = require("./keys.js");

const getApiResult = require("request");

const fs = require('fs');

//Spotify credentials
const Spotify = require('node-spotify-api');
const spotify = new Spotify(listOfKeys.spotify);

//Twitter credentials
const Twitter = require('twitter');

const client = new Twitter(listOfKeys.twitter);

const twitterBaseUrl = 'https://api.twitter.com/1.1/search/tweets.json';

function getlastTweets() {
    console.log("I have been called");
    client.get(twitterBaseUrl, {
        'from': 'jia001',
        'count': 20
    }, function(error, tweets, response) {
        var tweetList = tweets['statuses'];
        tweetList.forEach((ele,index) => {
            console.log(index+': ***'+ ele.text + '***. -----It was tweeted on ' + moment(ele.created_at,"dd MMM DD HH:mm:ss ZZ YYYY").toString());
            fs.appendFile('log.txt',index+': ***'+ ele.text + '***. -----It was tweeted on ' + moment(ele.created_at,"dd MMM DD HH:mm:ss ZZ YYYY",'en').toString()+'\n',function(){
            });
        });
     });
};

const [,, selApiStr, str1, str2] = process.argv;

const apiObj = {
    'my-tweets': function(str) {
        getlastTweets();
    },

    'spotify-this-song': function(str) {
        console.log(str);
    },

    'movie-this': function(str) {
        console.log(str);
    },

    'do-what-it-says': function(str) {
        console.log(str);
    }
}

var currOperation = apiObj[selApiStr];

currOperation(str1);

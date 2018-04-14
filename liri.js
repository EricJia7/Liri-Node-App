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
const omdbBaseUrl = "http://www.omdbapi.com/?apikey=trilogy&plot=short&t=";

const request = require('request');

const [,, selApiStr,...nameStr] = process.argv;
const credeStr = nameStr.join(' ');

function logFileBr() {
    fs.appendFile('log.txt', 'Above search executed on ' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a") + '!\n \n');
};

function getlastTweets() {
    client.get(twitterBaseUrl, {
        'from': 'jia001',
        'count': 20
    }).then(function(tweet,response) {
        // console.log(JSON.stringify(tweet, null, 2));
        var tweetList = tweet['statuses'];
        tweetList.forEach((ele,index) => {
            let timelog = moment.utc(ele.created_at,"dd MMM DD HH:mm:ss ZZ YYYY").local().format('dddd MMM DD HH:mm:ss z YYYY');
            console.log(index+': ***'+ ele.text + '***. -----It was tweeted on ' + timelog);
            debugger;
            fs.appendFile('log.txt',index+': '+ ele.text + '***. -----tweeted on ' + timelog +'\n',function(){
                if(index === tweetList.length-1) {
                    logFileBr();
                };
            });
        });
     }, function(err,response){
        console.log(err);
     });
};

function spotifySearch(str) {
    let songName;
    if(!str) {
        songName = "The Sign by Ace of Base";
    } else {
        songName = str;
    }
    spotify
        .search({type: 'track', query: songName})
        .then(function(data){
            console.log(JSON.stringify(data.tracks.items[0], null, 2));
            // console.log(data.tracks);
            console.log('\n'+"Search Result from Spotify:");
            console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
            console.log("The song's name: " + data.tracks.items[0].name);
            console.log("A preview link of the song from Spotify: " + data.tracks.items[0].external_urls.spotify);
            console.log("The album that the song is from: " + data.tracks.items[0].album.name);
            console.log('\n');
            fs.appendFile('log.txt', "Search Result from Spotify: " + '\n',(err) => {
                if(err) {console.log(err)}
            });
            fs.appendFile('log.txt', "Artist(s): " + data.tracks.items[0].artists[0].name + '\n',(err) => {
                if(err) {console.log(err)}
            });
            fs.appendFile('log.txt', "The song's name: " + data.tracks.items[0].name + '\n',(err) => {
                if(err) {console.log(err)}
            });
            fs.appendFile('log.txt', "A preview link of the song from Spotify: " + data.tracks.items[0].external_urls.spotify + '\n',(err) => {
                if(err) {console.log(err)}
            });
            fs.appendFile('log.txt', "The album that the song is from: " + data.tracks.items[0].album.name + '\n',(err) => {
                logFileBr();
                if(err) {
                    console.log(err)
                }
            });
        })
        .catch(function(err){
            console.log(err);
        })
};

function imdbSearch(str) {
    var mvName;
    if(!str) {
        mvName = "Mr. Nobody,";
    } else {
        mvName = str;
    };
    request(omdbBaseUrl+mvName, function(err,response,data){
        if(err) {
            console.log(err);
            return;
        };
        console.log(JSON.parse(data, null, 2));
        console.log('\n'+"Search Result from OMDB:");
        console.log("Movie Title: " + JSON.parse(data).Title);
        console.log("Released: " + JSON.parse(data).Released);
        console.log("IMDB Rating: " + JSON.parse(data).imdbRating);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(data).Ratings[1].Value);
        console.log("Country Produced: " + JSON.parse(data).Country);
        console.log("Language: " + JSON.parse(data).Language);
        console.log("Plot: " + JSON.parse(data).Plot);
        console.log("Actors: " + JSON.parse(data).Actors);
        console.log('\n');
        fs.appendFile('log.txt', "Search Result from OMDB: " + '\n',(err) => {
            if(err) {console.log(err)}
        });
        fs.appendFile('log.txt', "Movie Title: " + JSON.parse(data).Title + '\n',(err) => {
            if(err) {console.log(err)}
        });
        fs.appendFile('log.txt', "Released: " + JSON.parse(data).Released + '\n',(err) => {
            if(err) {console.log(err)}
        });
        fs.appendFile('log.txt', "IMDB Rating: " + JSON.parse(data).imdbRating + '\n',(err) => {
            if(err) {console.log(err)}
        });
        fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + JSON.parse(data).Ratings[1].Value + '\n',(err) => {
            if(err) {console.log(err)}
        });
        fs.appendFile('log.txt', "Country Produced: " + JSON.parse(data).Country + '\n',(err) => {
            if(err) {console.log(err)}
        });
        fs.appendFile('log.txt', "Language: " + JSON.parse(data).Language + '\n',(err) => {
            if(err) {console.log(err)}
        });
        fs.appendFile('log.txt', "Plot: " + JSON.parse(data).Plot + '\n',(err) => {
            if(err) {console.log(err)}
        });
        fs.appendFile('log.txt', "Actors: " + JSON.parse(data).Actors + '\n',(err) => {
            logFileBr();
            if(err) {
                console.log(err)
            }
        });
    });
};

function readRequest() {
    fs.readFile('random.txt','utf8', (err,data) => {
        if(err) throw err;
        data.split('\n').forEach(function(ele){
            if(ele.split(",").length>1) {
                let operation = ele.split(",")[0];
                let content = ele.split(/'/)[1];
                apiObj[operation](content);
            } else if (ele.split(",").length ===1) {
                let operation = ele.split(",")[0];
                apiObj[operation];
            };
        })
    })
};

const apiObj = {
    'my-tweets': function(str) {
        getlastTweets()
    },
    'spotify-this-song': function(str) {
        spotifySearch(str)
    },
    'movie-this': function(str) {
        imdbSearch(str)
    },
    'do-what-it-says': function(str) {
        readRequest()
    }
};

var currOperation = apiObj[selApiStr];

currOperation(credeStr);



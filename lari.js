// get our environment variables from an ignored .env
require("dotenv").config();

// add our dependencies for doing api things
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');

// gimme the keys giant dad. I got a date with susie
let keys = require('./keys.js');
// console.log(keys);

// lets get argumentative
let [node, script, command, input, input1] = process.argv;
// console.log(command);

// The argumentor, this takes commands and passes it down to
const argumentor = {
    handler: (func, input = false)=>{
        // pass in the command as a function
        argumentor[func](input);
    },
    'my-tweets': ()=>{
        // Create a twitter client
        let twitter_client = new Twitter(keys.twitter);
        // console.log(twitter_client);
        
        // This gets my latest tweets, and they come in packs o' twenty
        twitter_client.get('statuses/user_timeline', function(error, tweets, response) {
            if(error) throw error;
            
            // print keys
            // console.log(Object.keys(tweets));  // The favorites. 
            console.log('How \'bout some tweets from a twit?');
            // loop the response
            for (const twitKey in tweets) {
                // if property
                if (tweets.hasOwnProperty(twitKey)) {
                    // get the tweet and output its text
                    const tweet = tweets[twitKey];
                    //
                    // console.log(tweet);
                    console.log(tweet.text);
                    console.log('...was tweeted@' + tweet.created_at);
                }
            }
            
        });
    },
    'spotify-this-song': (song_name = false)=>{
        if(!song_name){
            song_name = 'The Sign';
        }

        // create new spotify client
        let spotify = new Spotify(keys.spotify);

        spotify.search({ type: 'track', query: song_name }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
          // dump items from spotify 
        //   console.log(data.tracks.items); 

          // set the items into a var for easy iteration
          const spotify_items = data.tracks.items;

          for (const spotKey in spotify_items) {
              if (spotify_items.hasOwnProperty(spotKey)) {
                  const spotify_song = spotify_items[spotKey];

                  console.log('Song Name: ' + spotify_song.name);
                  console.log('Song by...');
                  if(spotify_song.artists instanceof Array){
                    spotify_song.artists.map(mapOutArtist);
                  }
                  console.log('Preview Url: ' + spotify_song.preview_url);
                  console.log('Album: ' + spotify_song.album.name);
              }
          }

        });
    },
    'movie-this': (movName, movYear)=>{
        
        var omdbParams = {
            t: movName,
            y: movYear,
            apikey: '35613785'
        }
        
        var apiUrl = 'http://www.omdbapi.com/?';
        
        for (const key in omdbParams) {
            if (omdbParams.hasOwnProperty(key)) {
                apiUrl += `${key}=` + omdbParams[key] + '&'; 
            }
        }
        
        request(apiUrl, function( error, response, body){
            // console.log("error:", error);
            
            var results = JSON.parse(body);

            // console.log(results);
            let rotRating = '';
            if(results.Ratings instanceof Array){
                rotRating = results.Ratings.map(getRottenRating);
            }
            
            console.log(`${results.Title} came out ${results.Released}, and was made in ${results.Country}.
Its available in these language(s): ${results.Language}.\n${rotRating}\nPlot: ${results.Plot}\nStaring ${results.Actors}`);
        
        })
    },
    'do-what-it-says': ()=>{
        // read in a file
        fs.readFile('./random.txt', 'utf8', (err, file_data) => {
            if (err) throw err;
            // console.log(file_data);
            let fileInputs = file_data.split(',');
            
            argumentor.handler( fileInputs[0], fileInputs[1]);
          });
        
    }
}

const mapOutArtist = (artistObj) => {
    console.log( '\tArtist: ' + artistObj.name);
}

const getRottenRating = (ratings) => {
    if(ratings['Source']){
        return `${ratings['Source']} gave it a ${ratings['Value']} `;
    }
}

const logIt = (logMssg) => {
    console.log(logMssg);
    // then write to a file
}

// handle the argument
argumentor.handler( command, input, input1);
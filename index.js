// get our environment variables from an ignored .env
require("dotenv").config();

// add our dependencies for doing api things
let Twitter = require('twitter');
let Request = require('request');
let Spotify = require('node-spotify-api');
// gimme the keys giant dad. I got a date with susie
let keys = require('./keys.js');
// console.log(keys);

// lets get argumentative
let [node, script, command, input] = process.argv;
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
                    console.log('...Was tweeted@' + tweet.created_at);
                }
            }
            
        });
    },
    'spotify-this-song': (song_name)=>{
        // create new spotify client
        let spotify = new Spotify(keys.spotify);

        spotify.search({ type: 'track', query: song_name }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
           
          console.log(data.tracks.items); 
        });
    }
}

// handle the argument
argumentor.handler( command, input);
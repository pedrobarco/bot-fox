const commando = require('discord.js-commando');

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

class FaceItCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'faceit',
            group: 'games',
            memberName: 'faceit',
            description: 'check your faceit elo',
            examples: ['faceit [faceit id]'],
        });
    }

    async run(message, args) {
        var args_aux = args.split(" ");
        if (args.length == null) {
            message.reply("Something went wrong... Use '!help' command to know more about this.");
        } else {
            var faceitID = args_aux[0];
            var faceitURL = "http://faceitstats.com/profile,name," + faceitID;


            app.get('/scrape', function (req, res) {
                // The URL we will scrape from - in our example Anchorman 2.

                url = 'http://www.imdb.com/title/tt1229340/';

                // The structure of our request call
                // The first parameter is our URL
                // The callback function takes 3 parameters, an error, response status code and the html

                request(url, function (error, response, html) {

                    // First we'll check to make sure no errors occurred when making the request

                    if (!error) {
                        // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

                        var $ = cheerio.load(html);

                        // Finally, we'll define the variables we're going to capture

                        var title, release, rating;
                        var json = { title: "", release: "", rating: "" };

                        $('.header').filter(function () {
                            var data = $(this);
                            title = data.children().first().text();

                            // We will repeat the same process as above.  This time we notice that the release is located within the last element.
                            // Writing this code will move us to the exact location of the release year.

                            release = data.children().last().children().text();

                            json.title = title;

                            // Once again, once we have the data extract it we'll save it to our json object

                            json.release = release;
                        })


                    }
                })
            })




        }
    }
}

module.exports = FaceItCommand;
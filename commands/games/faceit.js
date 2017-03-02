const commando = require('discord.js-commando');

var request = require('request');
var cheerio = require('cheerio');

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
            var url = "http://faceitstats.com/profile,name," + faceitID;

            request(url, function (error, response, body) {
                if (!error) {
                    var $ = cheerio.load(body);

                    var rank = $('.customh3').eq(0).text();
                    var rankup = $('.elo-container').prev().text();

                    if (rank == null) {
                        message.reply("That user does not have rank! Maybe you didn't type it correctly.");
                    } else {
                        rankup = rankup.replace(/you need/g, ":");
                        message.reply(rank + "\n" + rankup);
                    }

                } else {
                    console.log("We’ve encountered an error: " + error);
                }
            });
        }
    }
}

module.exports = FaceItCommand;
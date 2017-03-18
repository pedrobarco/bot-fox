const commando = require('discord.js-commando');
const Discord = require('discord.js');

const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');


class RedditCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'reddit',
            group: 'social',
            memberName: 'reddit',
            description: 'Get the latest post that a certain user made on reddit',
            examples: ['reddit [-sub] <subreddit> [-u] <username>'],
        });
    }

    // TODO: Embed reddit link
    // TODO: flags for upvote (done) and subreddit (in-progress)

    async run(message, args) {
        delete require.cache[require.resolve('../../db.json')];
        const db = require ('../../db.json');
        const args_aux = args.split(" ");
        const username = db[message.author.id]["reddit"];


        if (args_aux.length == 1 && args_aux[0] == '') {
            if (username != null) {
                message.channel.sendMessage("https://www.reddit.com/user/" + username);
            }
            else {
                message.channel.sendMessage("Beep Boop! First add your reddit ID to database.");
            }
        }
        else if (args_aux.length == 1 && args_aux[0] != '') {
            if (args_aux[0] == "-up" || args_aux[0] == "--upvote") {
                if (username != null) {
                    message.channel.sendMessage("https://www.reddit.com/search?q=author%3A" + username + "&sort=new");
                }
                else {
                    message.channel.sendMessage("Beep Boop! First add your reddit ID to database.");
                }
            }
            else {
                message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
            }
        }
        else {
            message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
        }
    }
}

module.exports = RedditCommand;

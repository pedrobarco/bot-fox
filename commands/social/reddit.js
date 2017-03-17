const commando = require('discord.js-commando');
const Discord = require('discord.js');

const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('discord_db');

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

    async run(message, args) {
        let username;
        let id;

        await db.serialize(function () {
            db.get(`SELECT * FROM userdata WHERE discordID=${message.author.id}`, function (error, row) {
                if (row !== undefined && row.redditID !== null) {
                    username = row.redditID;
                }
                if (args.length == 0) {
                    if (username != null) {
                        message.channel.sendMessage("https://www.reddit.com/user/" + username);
                    }
                    else {
                        message.channel.sendMessage("Beep Boop! First add your reddit ID to database.");
                    }
                }
            });
        });

        // TODO: flags for upvote and subreddit (in-progress)
    }
}

module.exports = RedditCommand;

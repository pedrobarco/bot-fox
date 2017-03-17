const commando = require('discord.js-commando');
const Discord = require('discord.js');

let request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');

const config = require('../../settings');

class TwitchCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'twitch',
            group: 'social',
            memberName: 'twitch',
            description: 'Check if twitch stream is live',
            examples: ['twitch <twitchID>'],
        });
    }

    async run(message, args) {
        let args_aux = args.split(" ");
        const url = "https://api.twitch.tv/kraken/streams/" + args_aux[0] + "?oauth_token=" + config.twitchAPIkey;

        if (args.length == 1) {
            getStats(url);
        }
        else {
            message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
        }

        // ######################
        // # AUX FUNCTIONS HERE #
        // ######################

        function getStats(url) {
            const options = {
                uri: url,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };
            rp(options)
                .then(function ($) {
                    const parsed = JSON.parse($.text());
                    const live = parsed.stream;

                    if (live != null) {
                        const liveURL = live.channel.url;

                        const stats = 'Game: ' + live.channel.game +
                            '\nFollowers: ' + live.channel.followers +
                            '\nViews: ' + live.channel.views;

                        const embed = new Discord.RichEmbed()
                            .setAuthor(live.channel.name, 'https://files.catbox.moe/w2dr5d.jpg')
                            .setDescription(live.channel.status)
                            .setColor(0x6441A4)
                            .setURL(liveURL)
                            .addField('Live!', stats)
                            .setFooter('requested by ' + message.author.username, message.author.avatarURL);
                        message.channel.sendEmbed(embed);

                    } else {
                        message.channel.sendMessage("Beep Boop! Oh no, not live anymore...");
                    }
                });
            process.on('unhandledRejection', function (err) {
                throw err;
            });
            process.on('uncaughtException', function (err) {
                console.log(err);
                message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
            });
        }

    }
}

module.exports = TwitchCommand;

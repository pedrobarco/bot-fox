const commando = require('discord.js-commando');
const Discord = require('discord.js');

const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('discord_db');


class FaceItCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'faceit',
            group: 'games',
            memberName: 'faceit',
            description: 'Get a faceit user stats. Get your own stats by adding your username to database (!db help).',
            examples: ['faceit <faceituserID>', 'faceit'],
        });
    }

    async run(message, args) {
        const args_aux = args.split(" ");
        let url = "http://www.faceitstats.com/profile,name,";

        if (args.length == 0) {
            db.serialize(function () {
                db.get(`SELECT * FROM userdata WHERE discordID=${message.author.id}`, function (error, row) {
                    if (row !== undefined && row.faceitID !== null) {
                        getStats(row.faceitID);
                    } else {
                        getStats(null);
                    }
                });
            });
        } else {
            getStats(args_aux[0]);
        }

        // ######################
        // # AUX FUNCTIONS HERE #
        // ######################

        function getStats(id) {
            url += id;
            const options = {
                uri: url,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };
            rp(options)
                .then(function ($) {

                    const rank_span = $('.customh3 span');
                    const elo = rank_span.eq(0).text();
                    let level = rank_span.eq(1).text();

                    const rankup = $('.elo-container').prev().text();
                    const rankup_aux = rankup.split(" ");
                    level += ' (' + rankup_aux[6] + ' points to level ' + rankup_aux[3] + ')';

                    const stats_span = $('.boxStats span');
                    let matches_win = stats_span.eq(3).text();
                    const matches_ratio = stats_span.eq(7).text();
                    const matches = Math.round(eval(matches_win / (matches_ratio / 100)));

                    const kd = stats_span.eq(1).text();
                    const hs = stats_span.eq(5).text();

                    const alert = $('.alert').hasClass('alert');

                    const stats = 'Elo: ' + elo +
                        '\nLevel: ' + level +
                        '\nMatches: ' + matches +
                        '\nK/D: ' + kd +
                        '\nHS: ' + hs + '%';

                    if (alert) {
                        message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
                    } else {
                        const embed = new Discord.RichEmbed()
                            .setAuthor(id, 'https://files.catbox.moe/t0jwf4.jpg')
                            .setColor(0xFF3517)
                            .setURL(url)
                            .addField('Stats', stats)
                            .setFooter('requested by ' + message.author.username, message.author.avatarURL);
                        message.channel.sendEmbed(embed);
                    }
                });
            process.on('unhandledRejection', function (err) {
                console.log(err);
                throw err;
            });
            process.on('uncaughtException', function (err) {
                console.log(err);
                message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
            });
        }
    }
}

module.exports = FaceItCommand;

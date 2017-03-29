const commando = require('discord.js-commando');
const Discord = require('discord.js');

const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');

class FaceItCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'faceit',
            group: 'games',
            memberName: 'faceit',
            description: 'Get a faceit user stats. Get your own stats by adding your username to database (!help db).',
            examples: ['faceit <faceituserID>', 'faceit'],
        });
    }

    async run(message, args) {
        delete require.cache[require.resolve('../../db.json')];
        const db = require('../../db.json');
        const args_aux = args.split(" ");
        let url = "http://upixela.pl/faceit/profile.php?id=";
        const id = db[message.author.id]["faceit"];

        if (args.length == 0) {
            if (id != null) {
                getStats(id);
            }
            else {
                message.channel.sendMessage("Beep Boop! First add your faceit ID to database.");
            }
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

                    const rank = $('.player-elo i');
                    const elo = rank.eq(0).text();
                    let level = rank.eq(1).text();

                    const rankup = $('.player-reach').text();
                    const rankup_aux = rankup.split(" ");
                    level += ' (' + rankup_aux[6] + ' points to level ' + rankup_aux[3] + ')';
                    const alert = rankup_aux[6];

                    const stats_span = $('.stats_go h2');
                    const matches = stats_span.eq(1).text();
                    const kd = stats_span.eq(6).text();
                    const hs = stats_span.eq(7).text();

                    const stats = 'Elo: ' + elo +
                        '\nLevel: ' + level +
                        '\nMatches: ' + matches +
                        '\nK/D: ' + kd +
                        '\nHS: ' + hs;

                    if (!alert) {
                        message.channel.sendMessage("Beep Boop! Something went wrong... ID not found.");
                    }
                    else {
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

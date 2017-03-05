const commando = require('discord.js-commando');
const sql = require('sqlite');

var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');


class FaceItCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'faceit',
            group: 'games',
            memberName: 'faceit',
            description: 'Get a faceit user stats. Get your own stats by adding [-a] your username to database.',
            examples: ['faceit [faceit-id]', 'faceit [-a] [faceit-id]', 'faceit'],
        });
    }

    async run(message, args) {
        var args_aux = args.split(" ");
        var url = "http://faceitstats.com/profile,name,"

        if (args_aux[0] == "-a") {
            var new_faceitID = args_aux[1];
            sql.get(`SELECT * FROM userdata WHERE userId ='${message.author.id}'`).then(row => {
                if (!row) {
                    sql.run('INSERT INTO userdata (userId, faceitID) VALUES (?, ?)', [message.author.id, new_faceitID]);
                    message.reply("User added successfully. Type '!faceit' to see your stats.");
                } else {
                    row.faceitID = new_faceitID;
                    message.reply("User updated successfully.");
                }
            }).catch(() => {
                console.error;
                sql.run('CREATE TABLE IF NOT EXISTS userdata (userId TEXT, faceitID TEXT)').then(() => {
                    sql.run('INSERT INTO userdata (userId, faceitID) VALUES (?, ?)', [message.author.id, new_faceitID]);
                    message.reply("User added successfully. Type '!faceit' to see your stats.");
                });
            });
        } else {
            if (args.length == 0) {
                sql.get(`SELECT * FROM userdata WHERE userId ='${message.author.id}'`).then(row => {
                    if (!row) {
                        message.reply("Database user not found. Use -a flag to set it.");
                        return;
                    } else {
                        url = url + row.faceitID;
                        getStats(url);
                    }
                }).catch(() => {
                    console.error;
                    sql.run('CREATE TABLE IF NOT EXISTS userdata (userId TEXT, faceitID TEXT)');
                });
            } else {
                var faceitID = args_aux[0];
                url = url + faceitID;
                getStats(url);
            }
        }
        function getStats(id) {
            var options = {
                uri: url,
                transform: function (body) {
                    return cheerio.load(body);
                }
            };
            rp(options)
                .then(function ($) {
                    var rank = $('.customh3').eq(0).text();
                    var rankup = $('.elo-container').prev().text();
                    var stats = $('.boxStats').text();
                    rankup = rankup.replace(/you need/g, ":");
                    message.channel.sendMessage(rank + "\n" + rankup + "\n" + stats);
                })
            process.on('unhandledRejection', function (err) {
                throw err;
            });
            process.on('uncaughtException', function (err) {
                message.reply("That user does not have rank. Maybe you didn't type it correctly.");
            });
        }
    }
}

module.exports = FaceItCommand;
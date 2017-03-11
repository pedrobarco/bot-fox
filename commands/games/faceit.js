const commando = require('discord.js-commando');
const Discord = require('discord.js');

var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('discord_db');



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
    var args_aux = args.split(" ");
    var url = "http://faceitstats.com/profile,name,"

    if (args.length == 0) {
      db.serialize(function() {
        db.get(`SELECT * FROM userdata WHERE discordID=${message.author.id}`, function(error, row) {
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
      var options = {
        uri: url,
        transform: function (body) {
          return cheerio.load(body);
        }
      };
      rp(options)
      .then(function ($) {
        var elo = $('.customh3 span').eq(0).text();
        var level = $('.customh3 span').eq(1).text();

        var rankup = $('.elo-container').prev().text();
        var rankup_aux = rankup.split(" ");
        level += ' (' + rankup_aux[6] + ' points to level ' + rankup_aux[3] + ')';

        var matches_win = $('.boxStats span').eq(3).text();
        var matches_ratio = $('.boxStats span').eq(7).text();
        var matches = Math.round(eval(matches_win / (matches_ratio / 100)));
        var matches_win = $('.boxStats span').eq(3).text();

        var kd = $('.boxStats span').eq(1).text();
        var hs = $('.boxStats span').eq(5).text();

        var avatar = $('#userView img').attr('src');
        var alert = $('.alert').hasClass('alert');

        var stats = 'Elo: ' + elo +
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
          .setFooter('requested by ' + message.author.username, message.author.avatarURL)
          message.channel.sendEmbed(embed);
        }
      })
      process.on('unhandledRejection', function (err) {
        throw err;
      });
      process.on('uncaughtException', function (err) {
        message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
      });
    }
  }
}

module.exports = FaceItCommand;

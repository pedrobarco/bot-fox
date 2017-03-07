const commando = require('discord.js-commando');
const sql = require('sqlite');

var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');


const Discord = require('discord.js');


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
    var new_faceitID = args_aux[1];

    sql.get(`SELECT * FROM userdata WHERE userId ='${message.author.id}'`).then(row => {
      if (!row) {
        if (args_aux[0] == "-a") {
          sql.run('INSERT INTO userdata (userId, faceitID) VALUES (?, ?)', [message.author.id, new_faceitID]);
          message.channel.sendMessage("User added successfully. Type '!faceit' to see your stats.");
        } else {
          message.channel.sendMessage("Database user not found. Use -a flag to set it.");
          return;
        }
      } else {
        if (args_aux[0] == "-a") {
          row.faceitID = new_faceitID;
          message.channel.sendMessage("User updated successfully.");
        } else if (args.length == 0) {
          getStats(row.faceitID);
        } else {
          var faceitID = args_aux[0];
          getStats(faceitID);
        }
      }
    }).catch(() => {
      console.error;
      sql.run('CREATE TABLE IF NOT EXISTS userdata (userId TEXT, faceitID TEXT)').then(() => {
        sql.run('INSERT INTO userdata (userId, faceitID) VALUES (?, ?)', [message.author.id, new_faceitID]);
        message.channel.sendMessage("User added successfully. Type '!faceit' to see your stats.");
      });
    });

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
        var stats = $('.boxStats').text();
        var avatar = $('#userView img').attr('src');
        rankup = rankup.replace(/you need/g, ":");
        var alert = $('.alert').text();
        var stats = 'Elo: ' + elo + '\nLevel: ' + level;

        const embed = new Discord.RichEmbed()
        .setAuthor(id, 'https://files.catbox.moe/t0jwf4.jpg')
        .setColor(0xFF3517)
        .setURL(url)
        .addField('Stats', stats)
        .setFooter('requested by ' + message.author.username, message.author.avatarURL)
        message.channel.sendEmbed(embed);

      })
      process.on('unhandledRejection', function (err) {
        throw err;
      });
      process.on('uncaughtException', function (err) {
        message.channel.reply("Beep Boop! That user does not have rank. Maybe you didn't type it correctly.");
      });
    }
  }
}

module.exports = FaceItCommand;

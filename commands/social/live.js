const commando = require('discord.js-commando');

var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');

class LiveCommand extends commando.Command {

	constructor(client) {
		super(client, {
			name: 'live',
			group: 'social',
			memberName: 'live',
			description: 'Check if twitch stream is live',
			examples: ['live <twitchID>'],
		});
	}

	async run(message, args) {
		var args_aux = args.split(" ");
		var url = "http://twitch.tv/";
		var id = args_aux[0];

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
        var live = $('.balloon.balloon--tooltip.balloon--down.balloon--center').hasClass('.balloon.balloon--tooltip.balloon--down.balloon--center');

        if (live) {
          message.channel.sendMessage("LIVE");
        } else {
					message.channel.sendMessage("Beep Boop! Oh no, not live anymore...");
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

module.exports = LiveCommand;

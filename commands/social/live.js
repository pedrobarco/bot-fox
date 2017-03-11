const commando = require('discord.js-commando');
const Discord = require('discord.js');

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
		var url = "https://api.twitch.tv/kraken/streams/";
		var id = args_aux[0] + "?oauth_token=efrlnv1svzykmpagi2lz5loorsvu8f";

		getStats(id);

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
        var parsed =  JSON.parse($.text());
				var live = parsed.stream;

        if (live != null) {
					var liveURL = live.channel.url;

					var stats = 'Game: ' + live.channel.game +
	        '\nViews: ' + live.channel.views +
	        '\nFollowers: ' + live.channel.followers;

					const embed = new Discord.RichEmbed()
					.setAuthor(live.channel.name, 'https://files.catbox.moe/w2dr5d.jpg')
					.setDescription(live.channel.status)
					.setColor(0x6441A4)
					.setURL(liveURL)
					.addField('Live!', stats)
					.setFooter('requested by ' + message.author.username, message.author.avatarURL)
					message.channel.sendEmbed(embed);


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

const commando = require('discord.js-commando');
const Discord = require('discord.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('discord_db');

var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');

const bot = new commando.Client({
  owner: '279689384582840321'
});

db.on("error", function(error) {
  console.log("Getting an error : ", error);
});

bot.registry
.registerGroup('math', 'Math')
.registerGroup('games', 'Games')
.registerGroup('social', 'Social')
.registerGroup('database', 'Database')
.registerDefaults()
.registerCommandsIn(__dirname + "/commands");

bot.on('ready', () => {

  console.log('');
  console.log('######################');
  console.log('#                    #');
  console.log('# Bot Fox Connected! #');
  console.log('#                    #');
  console.log('######################');
  console.log('')
  console.log('--------------')
  console.log(' Online Stats')
  console.log('--------------')
  console.log('')
  console.log(` ${bot.guilds.size} guild(s)`);
  console.log(` ${bot.channels.size} channel(s)`);
  console.log(` ${bot.users.size} user(s)`);
  console.log('')
  console.log('')

});

bot.on('message', (message) => {
  if (message.author.bot) return; // Ignore bots.
});

bot.on('error', (e) => console.error(e));
bot.on('warn', (e) => console.warn(e));

bot.login('MjgxNTYzODYyODQxNDI1OTIx.C4dtkg.343Zvq5X-bfgyGQZzho-EA0o9kI');

// ######################
// # AUX FUNCTIONS HERE #
// ######################

// TODO: cronjob checkTwitch function

function checkTwitch() {
  var streams = ['zorlakoka','shroud','p4wnyhof','a_seagull','jcarverpoker'];

  for (var i = 0; i < streams.length; i++) {
    var url = "https://api.twitch.tv/kraken/streams/";
    var id = streams[i] + '?oauth_token=efrlnv1svzykmpagi2lz5loorsvu8f';
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
        '\nFollowers: ' + live.channel.followers +
        '\nViews: ' + live.channel.views;

        const embed = new Discord.RichEmbed()
        .setAuthor(live.channel.name, live.channel.logo)
        .setDescription(live.channel.status)
        .setColor(0x6441A4)
        .setURL(liveURL)
        .addField('Live!', stats)
        bot.channels.find('name', 'twitch').sendEmbed(embed);
      }
    })
  }
}

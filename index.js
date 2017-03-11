const commando = require('discord.js-commando');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('discord_db');

const bot = new commando.Client({
  owner: '279689384582840321'
});

db.on("error", function(error) {
  console.log("Getting an error : ", error);
});

db.close();

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

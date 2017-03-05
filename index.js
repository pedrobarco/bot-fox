const commando = require('discord.js-commando');
const sql = require('sqlite');
sql.open('./db.sqlite');

const bot = new commando.Client({
    owner: '279689384582840321'
});

bot.registry
    .registerGroup('math', 'Math')
    .registerGroup('games', 'Games')
    .registerDefaults()
    .registerCommandsIn(__dirname + "/commands");

bot.on('ready', () => {
  console.log('Ready!');
});

bot.on('message', message => {
    if (message.author.bot) return; // Ignore bots.
});

bot.login('MjgxNTYzODYyODQxNDI1OTIx.C4dtkg.343Zvq5X-bfgyGQZzho-EA0o9kI');
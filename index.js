const commando = require('discord.js-commando');

const bot = new commando.Client();

bot.registry.registerGroup('random', 'Random');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");


bot.login('MjgxNTYzODYyODQxNDI1OTIx.C4dtkg.343Zvq5X-bfgyGQZzho-EA0o9kI');
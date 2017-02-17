const commando = require('discord.js-commando');

const bot = new commando.Client({
    owner: '279689384582840321'
});

bot.registry
        .registerGroup('math', 'Math')
        .registerDefaults()
        .registerCommandsIn(__dirname + "/commands");


bot.login('MjgxNTYzODYyODQxNDI1OTIx.C4dtkg.343Zvq5X-bfgyGQZzho-EA0o9kI');
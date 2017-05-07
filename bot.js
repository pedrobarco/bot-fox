const commando = require('discord.js-commando');
const config = require('./settings');

const bot = new commando.Client({
    owner: config.owner
});

bot.registry
    .registerGroups([
        ['math', 'Math'],
        ['games', 'Games'],
        ['social', 'Social'],
        ['database', 'Database']
    ])

    .registerDefaults()
    .registerCommandsIn(__dirname + "/commands");

bot.on('ready', () => {

    console.log('');
    console.log('######################');
    console.log('#                    #');
    console.log('# Bot Fox Connected! #');
    console.log('#                    #');
    console.log('######################');
    console.log('');
    console.log('--------------');
    console.log(' Online Stats');
    console.log('--------------');
    console.log('');
    console.log(` ${bot.guilds.size} guild(s)`);
    console.log(` ${bot.channels.size} channel(s)`);
    console.log(` ${bot.users.size} user(s)`);
    console.log('');
    console.log('');

});

bot.on('error', (e) => console.error(e));
bot.on('warn', (e) => console.warn(e));

bot.login(config.token);

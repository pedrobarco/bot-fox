const Discord = require ('discord.js');
const bot = new Discord.Client();

bot.on('message', (message) =>{

    if(message.content == '!ping') {
        message.channel.sendMessage('Hey there!');
    }
});

bot.login('MjgxNTYzODYyODQxNDI1OTIx.C4drCw.0YtHf6WbAF-hWbu321eOuFz7Kck');

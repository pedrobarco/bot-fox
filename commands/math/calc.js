const commando = require('discord.js-commando');

class RollCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'calc',
            group: 'math',
            memberName: 'calc',
            description: 'calculate any math expression',
            examples: ['calc 20*5+2'],
        });
    }

    async run(message, args) {
        if(args.length == null){
            message.reply("Something went wrong... Use '!help' command to know more about this.");
        } else {
            var result = eval(args);
            message.reply(result);
        }
    }
}

module.exports = RollCommand;
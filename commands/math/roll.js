const commando = require('discord.js-commando');

class RollCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'roll',
            group: 'math',
            memberName: 'roll',
            description: 'generates a random number between two limits',
            examples: ['roll 0 100'],
        });
    }

    async run(message, args) {
        var args_aux = args.split(" ");
        var roll = Math.floor(Math.random() * args_aux[1] + args_aux[0]);

        if(args_aux.length == 2 && Number.isInteger(roll)){
            message.reply("You rolled a " + roll);
        } else {
            message.reply("Something went wrong... Use '!help' command to know more about this.");
        }
    }
}

module.exports = RollCommand;
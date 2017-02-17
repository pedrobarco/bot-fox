const commando = require('discord.js-commando');

class RollCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'roll',
            group: 'math',
            memberName: 'roll',
            description: 'Generates random number between two limits',
            examples: ['roll 0 100'],
        });
    }

    async run(message, args) {
        var args = args.split(" ");
        var roll = Math.floor(Math.random() * args[1] + args[0]);

        if(args.length == 2 && Number.isInteger(roll)){
            message.reply("You rolled a " + roll);
        } else {
            message.reply("Something went wrong... Use ONLY two integer numbers so I can calculate your roll.");
        }
    }
}

module.exports = RollCommand;
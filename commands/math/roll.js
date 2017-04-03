const commando = require('discord.js-commando');
const Discord = require('discord.js');

class RollCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'roll',
            group: 'math',
            memberName: 'roll',
            description: 'Generates a random number between two limits or random word given a list',
            examples: ['roll 0 100', 'roll foo bar 1 2 3'],
        });
    }

    run(message, args) {
        const args_aux = args.split(" ");
        const min = Math.round(args_aux[0]);
        const max = Math.round(args_aux[1]);
        const rng = Math.round(Math.random() * (max - min)) + min;
        const formula = Math.round(Math.random() * (args_aux.length - 1));
        const string_rng = args_aux[formula];
        let roll;

        if (args_aux.length == 1) {
            message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
        }
        else {
            if (args_aux.length == 2 && (!(isNaN(min) || isNaN(max)))) {
                roll = rng;
            }
            else {
                roll = string_rng;
            }
            const embed = new Discord.RichEmbed()
                .setAuthor(roll, 'https://files.catbox.moe/z99ldc.png')
                .setColor(0xb6f649)
                .setFooter('requested by ' + message.author.username, message.author.avatarURL);
            message.channel.sendEmbed(embed);
        }
    }
}

module.exports = RollCommand;

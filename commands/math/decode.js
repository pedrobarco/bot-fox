const commando = require('discord.js-commando');

class DecodeCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'decode',
            group: 'math',
            memberName: 'decode',
            description: 'converts a binary string to  a decoded one and vice-versa [-r]',
            examples: ['decode 1110100 1100101 1110011 1110100', 'decode -r test'],
        });
    }

    async run(message, args) {
        var args_aux = args.split(" ");
        var result = "";
        
        if(args.length == 0){
            message.reply("Something went wrong... Use '!help' command to know more about this.");
        }

        else if(args_aux[0] == "-r"){
            var parser = args.split("-r ");
            message.reply(parser[1]);
            for (var i = 0; i < parser[1].length; i++) {
                result += parser[1][i].charCodeAt(0).toString(2) + " ";               
            }
        } else {
            for (var i = 0; i < args_aux.length; i++) {
                result += String.fromCharCode(parseInt(args_aux[i], 2));
            }
        }

        if (result == ""){
            message.reply("Something went wrong... Use '!help' command to know more about this.");
        }
        else { message.reply(result); }
    }
}

module.exports = DecodeCommand;
const commando = require('discord.js-commando');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('discord_db');

class DBCommand extends commando.Command {

	constructor(client) {
		super(client, {
			name: 'db',
			group: 'database',
			memberName: 'db',
			description: 'Database features: Add [-a] Remove [-r] Change [-c]',
			examples: ['db -a faceit <username>'],
		});
	}

	async run(message, args) {
		var args_aux = args.split(" ");
    if (args_aux.length < 4) {
      message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
    }
    else {
      var flag = args_aux[2];
      var type = args_aux[3] + 'ID';
      var id = args_aux[4];
      if (flag == "-a") {
        // TODO: add user to database
      }
    }
	}
}

module.exports = DBCommand;

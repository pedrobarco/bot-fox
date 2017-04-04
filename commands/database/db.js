const commando = require('discord.js-commando');

const fs = require("fs");

fs.stat("./db.json", function(err, stat) {
    if(err == null) {
        console.log("db.json already exists");
    } else if(err.code == 'ENOENT') {
        fs.writeFile("./db.json", "{}");
    }
});

const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

class DBCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: 'db',
            group: 'database',
            memberName: 'db',
            description: 'Database features: Start [-init || -start] Add [-a || --add] Remove [-r || --remove] Change [-c || --change]',
            examples: ['db -start *start your database*', 'db -a faceit <username>'],
        });
    }

    async run(message, args) {
        const args_aux = args.split(" ");
        if (args_aux.length == 1) {
            if (args_aux[0] == "-init" || args_aux[0] == "-start") {
                if (!db[message.author.id]) {
                    db[message.author.id] = {
                        "steam": null,
                        "battlenet": null,
                        "twitch": null,
                        "reddit": null,
                        "youtube": null,
                        "faceit": null
                    };
                    message.channel.sendMessage("User registered successfully! Now you add your users to your account like so: `!db -a <plataformID> <username>`");
                }
                else {
                    message.channel.sendMessage("Beep Boop! You already have a registered account.");
                }
            }
            else {
                message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
            }
        }
        else if (args_aux.length == 3) {
            if (args_aux[0] == "--add" || args_aux[0] == "-a") {
                if (!db[message.author.id]) {
                    message.channel.sendMessage("Beep Boop! You do not have a registered account.");
                }
                else {
                    if (db[message.author.id].hasOwnProperty(args_aux[1])) {
                        const obj_id = db[message.author.id][args_aux[1]] = args_aux[2];
                        message.channel.sendMessage("User updated successfully!");
                    }
                    else {
                        message.channel.sendMessage("Beep Boop! Not a valid platform.");
                    }
                }
            }
            else {
                message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
            }
        }
        fs.writeFile('./db.json', JSON.stringify(db), (err) => {
            if (err) console.error(err)
        });
    }
}

module.exports = DBCommand;

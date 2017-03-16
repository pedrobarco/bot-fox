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

        if (args_aux.length < 3) {
            message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
        } else {
            var flag = args_aux[0];
            var type = args_aux[1] + 'ID';
            var id = args_aux[2];

            if (flag == "-a") {
                db.serialize(function () {
                    db.get(`SELECT * FROM userdata WHERE discordID=${message.author.id}`, function (error, row) {
                        if (row !== undefined) {
                            db.run(`UPDATE userdata SET ${type} = ? WHERE discordID = ?`, id, message.author.id);
                            message.channel.sendMessage("User info updated!");
                        } else {
                            var stmt = db.prepare(`INSERT INTO userdata (discordID, ${type}) VALUES (?,?)`);
                            stmt.run(message.author.id, id);
                            stmt.finalize();
                            message.channel.sendMessage("User info created!");
                        }
                    });
                });
            } else {
                message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
            }
        }
    }
}

module.exports = DBCommand;

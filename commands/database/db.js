const commando = require('discord.js-commando');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('discord_db');

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
        const args_aux = args.split(" ");

        if (args_aux.length < 3) {
            message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
        } else {
            const flag = args_aux[0];
            const type = args_aux[1] + 'ID';
            const id = args_aux[2];

            if (flag == "-a") {
                db.serialize(function () {
                    db.get(`SELECT * FROM userdata WHERE discordID=${message.author.id}`, function (error, row) {
                        if (row !== undefined) {
                            db.run(`UPDATE userdata SET ${type} = ? WHERE discordID = ?`, id, message.author.id);
                            message.channel.sendMessage("User info updated!");
                        } else {
                            const stmt = db.prepare(`INSERT INTO userdata (discordID, ${type}) VALUES (?,?)`);
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

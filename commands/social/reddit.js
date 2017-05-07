const commando = require('discord.js-commando');
const Discord = require('discord.js');

class RedditCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: "reddit",
            group: "social",
            memberName: "reddit",
            description: "Let your friends know about your reddit page.",
            examples: ["reddit [-sub]"],
        });
    }

    async run(message, args) {
        delete require.cache[require.resolve('../../db.json')];
        const db = require('../../db.json');
        const args_aux = args.split(" ");
        const username = db[message.author.id]["reddit"];

        if (args_aux.length == 1 && args_aux[0] == '') {
            if (username != null) {
                const embed = new Discord.RichEmbed()
                    .setAuthor(username, "https://files.catbox.moe/0nxl9m.png")
                    .setColor(0x149EF0)
                    .addField("User Profile", "Check my reddit user overview!")
                    .setURL("https://www.reddit.com/u/" + username)
                    .setFooter("requested by " + message.author.username, message.author.avatarURL);
                message.channel.sendEmbed(embed);
            }
            else {
                message.channel.sendMessage("Beep Boop! First add your reddit ID to database.");
            }
        }
        else if (args_aux.length == 1 && args_aux[0] == '-up') {
            if (username != null) {
                const embed = new Discord.RichEmbed()
                    .setAuthor(username, "https://files.catbox.moe/0nxl9m.png")
                    .setColor(0x149EF0)
                    .addField("Newest Post by Author", "Please help me get to the front page!")
                    .setURL("https://www.reddit.com/search?q=author%3A" + username + "&sort=new")
                    .setFooter("requested by " + message.author.username, message.author.avatarURL);
                message.channel.sendEmbed(embed);
            }
            else {
                message.channel.sendMessage("Beep Boop! First add your reddit ID to database.");
            }
        }
        else {
            message.channel.sendMessage("Beep Boop! Something went wrong... Use '!help' command to know more about this.");
        }
    }
}

module.exports = RedditCommand;

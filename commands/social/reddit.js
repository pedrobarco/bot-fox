const commando = require('discord.js-commando');

class RedditCommand extends commando.Command {

	constructor(client) {
		super(client, {
			name: 'reddit',
			group: 'social',
			memberName: 'reddit',
			description: 'Get the latest post that a certain user made on reddit',
			examples: ['reddit <username>'],
		});
	}

	async run(message, args) {
		var args_aux = args.split(" ");

		message.reply("https://www.reddit.com/r/GlobalOffensiveTrade/search?q=" + args_aux[0] + "&sort=new&restrict_sr=on")
		// TODO: flags for upvote and subreddit
	}
}

module.exports = RedditCommand;

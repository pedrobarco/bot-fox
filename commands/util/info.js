const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const pkg = require('../../package')
module.exports = class RollCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'info',
      group: 'util',
      memberName: 'info',
      aliases: ['stats'],
      description: 'Get bot and dev stats, uptime, etc'
    })
  }

  async run (msg, args) {
    const embed = new RichEmbed()
      .setAuthor(`🤖 Fox 🤖`)
      .setThumbnail(this.client.user.avatarURL)
      .setColor(0xDC8653)
      .addField('Version', pkg.version, true)
      .addField('Library', `Discord.js ${pkg.dependencies['discord.js']}`, true)
      .addField('Users', this.client.users.size, true)
      .addField('Commands', this.client.registry.commands.size, true)
      .addField('Author', pkg.author, true)
      .addField('Devs', `[\`2menta2#4574\`](http://www.github.com/pedrobarco)\n[\`guimscs#7731\`](http://www.github.com/gmscs)`, true)
      .setFooter(`Requested by ${msg.author.username}`, msg.author.avatarURL)
    return msg.embed(embed)
  }
}

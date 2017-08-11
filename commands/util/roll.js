const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class RollCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'roll',
      group: 'util',
      memberName: 'roll',
      description: 'Generates a random number between two limits or a random word given a list',
      examples: ['roll 0 100', 'roll foo bar 1 2 3']
    })
  }

  run (msg, args) {
    args = args.split(' ')
    const min = Math.round(args[0])
    const max = Math.round(args[1])
    const rng = Math.round(Math.random() * (max - min)) + min
    const formula = Math.round(Math.random() * (args.length - 1))
    const rngString = args[formula]
    let roll
    if (args.length < 2) {
      return msg.say(`Some arguments are missing. For more information type \`!help ${this.name}\``)
    } else {
      if (args.length === 2 && (!(isNaN(min) || isNaN(max)))) {
        roll = rng
      } else {
        roll = rngString
      }
      const embed = new RichEmbed()
        .setAuthor(`🎲 ${roll} 🎲`)
        .setColor(0x00AE86)
        .setFooter(`Requested by ${msg.author.username}`, msg.author.avatarURL)
      return msg.embed(embed)
    }
  }
}

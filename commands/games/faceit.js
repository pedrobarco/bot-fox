const commando = require('discord.js-commando')
const Discord = require('discord.js')

const rp = require('request-promise')
const cheerio = require('cheerio')

class FaceItCommand extends commando.Command {
  constructor (client) {
    super(client, {
      name: 'faceit',
      group: 'games',
      memberName: 'faceit',
      description: 'Get a faceit user stats. Get your own stats by adding your username to database (!help db).',
      examples: ['faceit <faceituserID>', 'faceit']
    })
  }

  async run (message, args) {
    delete require.cache[require.resolve('../../db.json')]
    const db = require('../../db.json')
    const argsAux = args.split(' ')
    let url = 'http://upixela.pl/faceit/profile.php?id='
    const id = db[message.author.id]['faceit']

    if (args.length === 0) {
      if (id != null) {
        getStats(id)
      } else {
        message.channel.sendMessage('Beep Boop! First add your faceit ID to database.')
      }
    } else {
      getStats(argsAux[0])
    }

    function getStats (id) {
      url += id
      const options = {
        uri: url,
        transform: function (body) {
          return cheerio.load(body)
        }
      }
      rp(options)
        .then(function ($) {
          const rank = $('.player-elo i')
          const elo = rank.eq(0).text()
          let level = rank.eq(1).text()

          const rankup = $('.player-reach').text()
          const rankupAux = rankup.split(' ')
          level += ' (' + rankupAux[6] + ' points to level ' + rankupAux[3] + ')'

          const alert = rankupAux[6]
          const statsSpan = $('.stats_go h2')
          const matches = statsSpan.eq(1).text()
          const kd = statsSpan.eq(6).text()
          const hs = statsSpan.eq(7).text()

          const stats = 'Elo: ' + elo +
            '\nLevel: ' + level +
            '\nMatches: ' + matches +
            '\nK/D: ' + kd +
            '\nHS: ' + hs

          if (!alert) {
            message.channel.sendMessage('Beep Boop! Something went wrong... ID not found.')
          } else {
            const embed = new Discord.RichEmbed()
              .setAuthor(id)
              .setColor(0xFF3517)
              .setURL(url)
              .addField('Stats', stats)
              .setFooter('requested by ' + message.author.username, message.author.avatarURL)
            message.channel.sendEmbed(embed)
          }
        })
      process.on('unhandledRejection', function (err) {
        console.log(err)
        throw err
      })
      process.on('uncaughtException', function (err) {
        console.log(err)
        message.channel.sendMessage('Beep Boop! Something went wrong... Use \'!help\' command to know more about this.')
      })
    }
  }
}

module.exports = FaceItCommand

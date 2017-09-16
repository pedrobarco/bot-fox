const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const sqlite = require('sqlite')
const path = require('path')
const oneLine = require('common-tags').oneLine
const config = require('./config')

const client = new CommandoClient({
  commandPrefix: config.handler,
  owner: config.owner,
  disableEveryone: true,
  unknownCommandResponse: false
})

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['util', 'Util'],
    ['games', 'Games'],
    ['social', 'Social'],
    ['database', 'Database']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'))

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', () => {
    client.user.setGame(`${config.handler}help for support`)
    console.log(`Client ready. Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`)
  })
  .on('disconnect', () => {
    console.warn('Disconnected!')
  })
  .on('reconnecting', () => {
    console.warn('Reconnecting...')
  })
  .on('commandError', (cmd, err) => {
    if (err instanceof CommandoClient.FriendlyError) return
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err)
  })
  .on('commandBlocked', (msg, reason) => {
    console.log(oneLine`
    Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
    blocked; ${reason}
    `)
  })
  .on('commandPrefixChange', (guild, prefix) => {
    console.log(oneLine`
    Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
    ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
    `)
  })
  .on('commandStatusChange', (guild, command, enabled) => {
    console.log(oneLine`
      Command ${command.groupID}:${command.memberName}
      ${enabled ? 'enabled' : 'disabled'}
      ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
    `)
  })
  .on('groupStatusChange', (guild, group, enabled) => {
    console.log(oneLine`
      Group ${group.id}
      ${enabled ? 'enabled' : 'disabled'}
      ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
    `)
  })

sqlite.open(path.join(__dirname, 'settings.sqlite3')).then((db) => {
  client.setProvider(new SQLiteProvider(db))
})

client.login(config.token)

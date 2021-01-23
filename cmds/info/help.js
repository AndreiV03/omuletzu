const Discord = require('discord.js');
const Guild = require('../../models/guild');

module.exports = {
  name: 'help',
  aliases: ['cmds'],
  color: '#fcc95e',
  cooldown: 3,
  guildOnly: false,
  async execute(message, args, client) {
    const settings = await Guild.findOne({
      guildID: message.guild.id
    }, (error) => {
      if (error) console.error(error);
    });
    const prefix = settings.prefix;

    if (!args[0]) {
      const helpEmbed = {
        color: '#fcc95e',
        title: `➔ Comenzile disponibile ale lui Omuletzu'`,
        description: `Scrie în chat \`${prefix}help <nume comandă>\` pentru a afla mai multe detalii despre o comandă!`,
        fields: [
          {
            name: '➔ Comenzi generale:',
            value: `\`userinfo | serverinfo | weather | oldest | youngest | ping | invite\`\n`,
            inline: false 
          },
          {
            name: '➔ Comenzi speciale:',
            value: `\`giveaway\`\n`,
            inline: false 
          },
          {
            name: '➔ Moderarea și administrarea server-ului:',
            value: `\`logschannel | modrole | modroles | ban | clearban | unban | kick | warn | warns | removewarn | removewarns | maxwarns | clear | prefix\`\n`,
            inline: false 
          },
          {
            name: '➔ Jocuri:',
            value: `\`leaderboard | guess | hangman\`\n`,
            inline: false 
          },
          {
            name: '➔ Comenzi amuzante:',
            value: `\`say | gay | simp | penis | iq | tall\`\n`,
            inline: false 
          }
        ]
      };
      return message.channel.send({ embed: helpEmbed }).catch(error => console.error(error));
    } else {
      if (!client.commands.get(args[0].toLowerCase())) return message.reply(`nu există această comandă! Folosește \`${prefix}help\` pentru a vedea o listă cu toate comenzile disponibile.`);

      const commandName = args[0].toLowerCase();
      const command = client.commands.get(commandName);
      if (command.name == 'reload' || command.name == 'help') return message.reply('nu poti folosi această comandă!');

      const commandEmbed = new Discord.MessageEmbed();
      let aliasesInfo, footer = '';

      if (command) {
        if (command.aliases) aliasesInfo = `Poti folosi și comanda \`${prefix}${command.aliases[0]}\`.`;
        if (command.description) commandEmbed.setDescription(`${command.description}${aliasesInfo ? '\n' + aliasesInfo : ''}`);
        if (command.usage) {
          commandEmbed.addField('Mod de folosire:', `\`\`\`${prefix}${command.name} ${command.usage}\`\`\``);
          footer += `Nu scrie caracterele "<" și ">".`;
        }
        if (command.id) footer += `\nPoti folosi ID-ul membrului fără să-l mentionezi.`;
        if (footer) commandEmbed.setFooter(footer);
        if (command.permissions) {
          let permissions = '';
          command.permissions.forEach(permission => {
            permissions += `${permission}\n`;
          });
          commandEmbed.addField('Permisiuni necesare:', `\`\`\`${permissions}\`\`\``);
        }
        if (command.cooldown) {
          const commandCooldown = command.cooldown >= 20 ? command.cooldown + ' de secunde' : command.cooldown + ' secunde';
          commandEmbed.addField('Cooldown:', `\`\`\`${commandCooldown}\`\`\``);
        }
        if (command.color) commandEmbed.setColor(`${command.color}`);
      }
      return message.channel.send(commandEmbed);
    }
  }
};
const { MessageEmbed } = require('discord.js');

const checkin = require('../../../../../database/models/Checkin');

module.exports.run = async (interaction) => {
  const oldEmbed = interaction.message.embeds[0];
  const userID = oldEmbed.fields.find((field) => field.name === 'ID').value;
  await checkin.update({ ongoing: false, alreadyChecked: true }, { where: { ID: userID } });
  const member = interaction.guild.members.cache.get(userID);
  const embedUser = new MessageEmbed()
    .setTitle('Verification allowed')
    .setDescription('Your Verification has been allowed. Have fun in the server!')
    .setColor('GREEN');
  const embedLog = new MessageEmbed()
    .setTitle('Verification allowed')
    .setDescription(oldEmbed.description)
    .setColor('GREEN')
    .setThumbnail(oldEmbed.thumbnail.url)
    .addField('Allowed by', `${interaction.user}`)
    .addFields(oldEmbed.fields);
  if (member) {
    member.roles.add(config.functions.checkin.roles.add.allow);
    member.roles.add(config.functions.checkin.roles.add.allowNewComers);
    member.roles.remove(config.functions.checkin.roles.remove);
    await member.user.send({ embeds: [embedUser] }).catch(() => {});
  }
  const logChannel = interaction.guild.channels.cache.get(config.functions.checkin.outputChannels.log);
  await logChannel.send({ embeds: [embedLog] });
  await interaction.message.delete();
};

module.exports.data = {
  name: 'allow',
};

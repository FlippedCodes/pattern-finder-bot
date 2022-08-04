const { MessageEmbed } = require('discord.js');

const checkin = require('../../../../../database/models/Checkin');

module.exports.run = async (interaction) => {
  interaction.deferUpdate();
  const reason = interaction.fields.getTextInputValue('denyReasonText') || 'No reason given';
  const oldEmbeds = interaction.message.embeds;
  if (oldEmbeds.length === 0) interaction.user.send('This verification broken! Please reach out to phil.');
  const oldEmbed = oldEmbeds[0];
  const userID = oldEmbed.fields.find((field) => field.name === 'ID').value;
  await checkin.update({ ongoing: false, alreadyChecked: false }, { where: { ID: userID } });
  const member = interaction.guild.members.cache.get(userID);
  const embedUser = new MessageEmbed()
    .setTitle('Verification denied')
    // .setDescription('Your Verification has been denied!')
    .addField('Reason', reason)
    .addField('Denied by', `${interaction.user}`)
    .setColor('RED');
  const embedLog = new MessageEmbed()
    .setTitle('Verification denied')
    .setDescription(oldEmbed.description)
    .setColor('RED')
    .setThumbnail(oldEmbed.thumbnail.url)
    .addField('Reason', reason)
    .addField('Denied by', `${interaction.user}`)
    .addFields(oldEmbed.fields);
  if (member) {
    // member.roles.add(config.functions.checkin.roles.add.deny);
    await member.user.send({ content: `Your Message:\n${oldEmbed.description}`, embeds: [embedUser] }).catch(() => {});
  }
  const logChannel = interaction.guild.channels.cache.get(config.functions.checkin.outputChannels.log);
  await logChannel.send({ embeds: [embedLog] });
  await interaction.message.delete();
};

module.exports.data = {
  name: 'denyReason',
};

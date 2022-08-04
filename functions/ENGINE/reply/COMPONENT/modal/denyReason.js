const { EmbedBuilder } = require('discord.js');

// const checkin = require('../../../../../database/models/Checkin');

module.exports.run = async (interaction) => {
  interaction.deferUpdate();
  const reason = interaction.fields.getTextInputValue('denyReasonText') || 'No reason given';
  const oldEmbeds = interaction.message.embeds;
  if (oldEmbeds.length === 0) interaction.user.send('This verification broken! Please reach out to phil.');
  const oldEmbed = oldEmbeds[0];
  const userID = oldEmbed.fields.find((field) => field.name === 'ID').value;
  await checkin.update({ ongoing: false, alreadyChecked: false }, { where: { ID: userID } });
  const member = interaction.guild.members.cache.get(userID);
  const embedUser = new EmbedBuilder()
    .setTitle('Verification denied')
    // .setDescription('Your Verification has been denied!')
    .addField('Reason', reason)
    .addField('Denied by', `${interaction.user}`)
    .setColor('Red');
  const embedLog = new EmbedBuilder()
    .setTitle('Verification denied')
    .setDescription(oldEmbed.description)
    .setColor('Red')
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

/*
const reply = require('../../database/models/Reply');

function sendMessage(EmbedBuilder, interaction, userTag, userID, age, DoB, teammemberTag) {
  // needs to be local as settings overlap from different embed-requests
  const embed = new EmbedBuilder();

  embed
    .setColor('Green')
    .setDescription(`${userTag} got added to the DB!`)
    .addFields([
      { name: 'ID', value: userID, inline: true },
      { name: 'Age', value: String(age), inline: true },
      { name: 'DoB', value: DoB, inline: true },
      { name: 'Created by', value: teammemberTag, inline: true },
    ]);

  const content = { embeds: [embed] };
  // send feedback
  interaction.reply(content);
  // send in log
  interaction.guild.channels.cache.find(({ id }) => id === config.logChannelID).send(content);
}

async function addUser(ID, DoB, teammemberID) {
  if (await reply.findOne({ where: { ID } }).catch(ERR)) return false;
  await reply.findOrCreate({ where: { ID }, defaults: { DoB, teammemberID } }).catch(ERR);
  return true;
}

function getAge(moment, DoB) {
  const age = moment().diff(DoB, 'years');
  return age;
}

module.exports.run = async (interaction, moment, EmbedBuilder) => {
  const command = interaction.options;
  // get user and ID
  const user = command.getUser('user', true);
  const userID = user.id;
  // get date
  const date = moment(command.getString('date', true), config.commands.DoBchecking.dateFormats, false);
  // validate date
  if (!date.isValid()) return messageFail(interaction, 'Your provided DoB is not a date!');
  // get age
  const age = getAge(moment, date);
  // format date
  const formatDate = date.format(config.commands.DoBchecking.dateFormats[0]);
  // add entry
  const added = await addUser(userID, formatDate, interaction.user.id);
  // report to user if entry added
  if (added) {
    // send log and user confirmation
    sendMessage(EmbedBuilder, interaction, user.tag, userID, age, formatDate, interaction.user.tag);
  } else {
    messageFail(interaction, 'Entry already exists. Update it with the change command.');
  }
};

module.exports.data = { subcommand: true };
*/

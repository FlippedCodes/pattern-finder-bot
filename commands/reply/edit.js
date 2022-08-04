const reply = require('../../database/models/Reply');

function sendMessage(EmbedBuilder, interaction, userTag, userID, age, DoB, teammemberTag) {
  // needs to be local as settings overlap from different embed-requests
  const embed = new EmbedBuilder();

  embed
    .setColor('GREEN')
    .setDescription(`${userTag} got updated in the DB!`)
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

async function updateUser(ID, DoB, teammemberID) {
  if (!await reply.findOne({ where: { ID } }).catch(ERR)) return false;
  await reply.update({ DoB, teammemberID }, { where: { ID } }).catch(ERR);
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
  const added = await updateUser(userID, formatDate, interaction.user.id);
  // report to user if entry added
  if (added) {
    // send log and user confirmation
    sendMessage(EmbedBuilder, interaction, user.tag, userID, age, formatDate, interaction.user.tag);
  } else {
    messageFail(interaction, 'Entry doesn\'t exist yet. Use the add command to add it first.');
  }
};

module.exports.data = { subcommand: true };

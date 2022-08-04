// const userDoB = require('../../database/models/UserDoB');

function sendMessage(MessageEmbed, interaction, userTag, userID, age, DoB, teammemberTag) {
  // needs to be local as settings overlap from different embed-requests
  const embed = new MessageEmbed();

  embed
    .setColor('GREEN')
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
  if (await userDoB.findOne({ where: { ID } }).catch(ERR)) return false;
  await userDoB.findOrCreate({ where: { ID }, defaults: { DoB, teammemberID } }).catch(ERR);
  return true;
}

function getAge(moment, DoB) {
  const age = moment().diff(DoB, 'years');
  return age;
}

module.exports.run = async (interaction, moment, MessageEmbed) => {
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
    sendMessage(MessageEmbed, interaction, user.tag, userID, age, formatDate, interaction.user.tag);
  } else {
    messageFail(interaction, 'Entry already exists. Update it with the change command.');
  }
};

module.exports.data = { subcommand: true };

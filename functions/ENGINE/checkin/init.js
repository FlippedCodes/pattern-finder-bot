const moment = require('moment');

const {
  MessageEmbed, MessageActionRow, MessageButton, TextInputComponent,
} = require('discord.js');

const checkin = require('../../../database/models/Checkin');

const userDoB = require('../../../database/models/UserDoB');

const dateRegEx = /\d{4}[-]\d{2}[-]\d{2}/gm;

// const templateRegEx = /\b(VRChat Name|DoB|About Me)\b/gm;

async function checkOngoing(ID) {
  const result = await checkin.findOne({ where: { ID } });
  return result.ongoing;
}

async function recordDoB(ID, date) {
  const result = await userDoB.findOrCreate({ where: { ID }, defaults: { DoB: date.format(), teammemberID: client.user.id } }).catch(ERR);
  if (result[1]) return true;
  const indentical = moment(result[0].DoB).isSame(date);
  return indentical;
}

function sendToVerification(message, date, currentCheckin) {
  // needs to be inited here: client not ready yet on startup
  const buttons = new MessageActionRow()
    .addComponents([
      new MessageButton()
        .setCustomId('allow')
        .setEmoji(client.guilds.cache.get(config.customEmoji.serverID).emojis.cache.get(config.customEmoji.emoji.allow))
        .setLabel('Allow in')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('deny')
        .setEmoji('✖️')
        .setLabel('Keep out')
        .setStyle('DANGER'),
    ]);
  const DoB = date.format('YYYY-MM-DD');
  const creationDate = moment(message.author.createdAt).format('X');
  const age = moment().diff(date, 'years');
  const embed = new MessageEmbed()
    .setAuthor({ name: message.author.tag })
    .setThumbnail(message.author.displayAvatarURL({ extension: 'png', size: 4096 }))
    .setDescription(message.content)
    .addField('Was verfied before', prettyCheck(currentCheckin.alreadyChecked), true)
    .addField('Verification attempt', `${currentCheckin.count}${currentCheckin.count === 1 ? '' : '⚠️'}`, true)
    .addField('DoB', `${DoB}`, true)
    .addField('Age', `${age}${age >= 16 ? '' : '⚠️'}`, true)
    .addField('Creation Date', `<t:${creationDate}:D>`, true)
    .addField('Since creation', `<t:${creationDate}:R>`, true)
    .addField('ID', message.author.id, true)
    .addField('User mention', `${message.author}`, true);
  client.channels.cache.get(config.functions.checkin.outputChannels.todo).send({ embeds: [embed], components: [buttons] });
}

async function checkinOngoing(message, reason) {
  const embed = new MessageEmbed()
    .setTitle('Verification ongoing')
    .setColor('BLUE')
    .setDescription(reason);
  // send message back to user
  const inServerReply = await message.author.send({ embeds: [embed] })
    .catch(() => message.reply({ embeds: [embed] }));
  // delete old message
  message.delete();
  if (inServerReply.type === 'REPLY') setTimeout(() => inServerReply.delete(), 20000);
}

async function checkinFailed(message, reason) {
  const embed = new MessageEmbed()
    .setTitle('Verification declied')
    .setColor('RED')
    .setDescription(reason);
  // send message back to user
  const inServerReply = await message.author.send({ content: `Your Message:\n${message.content}`, embeds: [embed] })
    .catch(() => message.reply({ content: `Unable to DM you the following message\n You have 20 secounds to copy your message:\n\n${message.content}`, embeds: [embed] }));
  // delete old message
  message.delete();
  if (inServerReply.type === 'REPLY') setTimeout(() => inServerReply.delete(), 20000);
}

module.exports.run = async (message) => {
  // debug protection
  // if (DEBUG) return;

  const userID = message.author.id;

  // create checkin profile if it doesn't exist
  await checkin.findOrCreate({ where: { ID: userID } }).catch(ERR);

  if (await checkOngoing(userID)) return checkinFailed(message, 'You already have an ongoing verification! Please wait and be patient.');

  if (message.member.roles.cache.has(config.functions.checkin.roles.add.allow)) return checkinFailed(message, 'You are already verified!');
  // if (message.member.roles.cache.has(config.functions.checkin.roles.add.deny)) return checkinFailed(message, 'You have been denied already!');

  // DEPRECATED: Peoples IQ is too lox to use this right
  // const templateCheck = message.content.match(templateRegEx);
  // if (!templateCheck) return checkinFailed(message, 'Please follow the template!\n\nVRChat Name:\nDoB:\nAbout Me:');
  // if (templateCheck.length !== 3) return checkinFailed(message, 'Please follow the template!\n\nVRChat Name:\nDoB:\nAbout Me:');

  // get birthday
  const rawDate = message.content.match(dateRegEx);
  if (!rawDate) return checkinFailed(message, 'Please mention your birthday in the format `YYYY-MM-DD`.');
  const date = moment(rawDate[0], config.commands.DoBchecking.dateFormats, true);
  if (!date.isValid()) return checkinFailed(message, 'Please mention your birthday in the format `YYYY-MM-DD`.');

  await checkin.update({ ongoing: true }, { where: { ID: userID } });
  await checkin.increment('count', { by: 1, where: { ID: userID } });

  const DoBSame = await recordDoB(userID, date);
  if (!DoBSame) return checkinFailed(message, 'Your birthday is not the same as previosly mentioned. Please reach out to a staffmember to clear this issue.');

  const currentCheckin = await checkin.findOne({ where: { ID: userID } });

  // send message to new channel
  sendToVerification(message, date, currentCheckin);
  // delete old message and
  // DM user/send message in user channel
  checkinOngoing(message, 'Your verification has been started. Please wait for a staffmember to verify you.');
};

module.exports.data = {
  name: 'init',
};

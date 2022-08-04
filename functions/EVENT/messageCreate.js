module.exports.run = async (message) => {
  // return if unwanted
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  if (message.channel.id === config.functions.messageCreate.checkinChannelID) client.functions.get('ENGINE_checkin_init').run(message);
};

module.exports.data = {
  name: 'messageCreate',
};

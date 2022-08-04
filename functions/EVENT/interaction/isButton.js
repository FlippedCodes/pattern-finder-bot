module.exports.run = async (interaction) => {
  if (interaction.channelId === config.functions.checkin.outputChannels.todo) {
    if (!interaction.member.roles.cache.has(config.teamRole)) return;
    return client.functions.get(`ENGINE_checkin_COMPONENT_button_${interaction.customId}`).run(interaction).catch(ERR);
  }
};

module.exports.data = {
  name: 'isCommand',
};

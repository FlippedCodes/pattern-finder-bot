const {
  MessageActionRow, Modal, TextInputComponent, MessageEmbed,
} = require('discord.js');

module.exports.run = async (interaction) => {
  const modal = new Modal()
    .setCustomId('denyReason')
    .setTitle('Reason for keeping out');
  const actionsRow = new MessageActionRow()
    .addComponents([
      new TextInputComponent()
        .setCustomId('denyReasonText')
        .setLabel('What was the reason for denying this user?')
        .setStyle('SHORT'),
    ]);
  modal.addComponents(actionsRow);
  await interaction.showModal(modal);
};

module.exports.data = {
  name: 'deny',
};

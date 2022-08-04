const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports.run = async (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId('addTemplate')
    .setTitle('Setup');
  const title = new ActionRowBuilder().addComponents([
    new TextInputBuilder()
      .setCustomId('title')
      .setLabel('Title')
      .setStyle(TextInputStyle.Short),
  ]);
  const body = new ActionRowBuilder().addComponents([
    new TextInputBuilder()
      .setCustomId('body')
      .setLabel('What was the reason for denying this user?')
      .setStyle(TextInputStyle.Paragraph),
  ]);
  const footer = new ActionRowBuilder().addComponents([
    new TextInputBuilder()
      .setCustomId('footer')
      .setLabel('What was the reason for denying this user?')
      .setStyle(TextInputStyle.Short),
  ]);
  modal.addComponents(title, body, footer);
  await interaction.showModal(modal);
};

module.exports.data = { subcommand: true };

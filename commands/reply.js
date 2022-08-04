const { EmbedBuilder } = require('discord.js');

module.exports.run = async (interaction) => {
  // only guild command
  if (!await interaction.inGuild()) return messageFail(interaction, 'This comamnd is for servers only.');
  // check if user is teammember
  if (!interaction.memberPermissions.has('MANAGE_GUILD')) return messageFail(interaction, `You are not authorized to use \`/${module.exports.data.name}\``);
  const subName = interaction.options.getSubcommand();
  client.commands.get(`${module.exports.data.name}_${subName}`).run(interaction, EmbedBuilder);
};

module.exports.data = new CmdBuilder()
  .setName('reply')
  .setDescription('Manage the replies the bot gives to found searches.')
  .addSubcommand((subcommand) => subcommand
    .setName('add')
    .setDescription('Adds a reply.')
    .addStringOption((option) => option
      .setName('name')
      .setDescription('Provide a name for this reply.')
      .setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('edit')
    .setDescription('Edit a reply.')
    .addStringOption((option) => option
      .setName('name')
      .setDescription('Search for the reply you want to edit.')
      .setAutocomplete(true)
      .setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('preview')
    .setDescription('Preview a reply.')
    .addStringOption((option) => option
      .setName('name')
      .setDescription('Search for the reply you want to preview.')
      .setAutocomplete(true)
      .setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('delete')
    .setDescription('Delete a reply.')
    .addStringOption((option) => option
      .setName('name')
      .setDescription('Search for the reply you want to delete.')
      .setAutocomplete(true)
      .setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('list')
    .setDescription('List all the replies.'));

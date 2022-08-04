const moment = require('moment');

const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction) => {
  // only guild command
  if (!await interaction.inGuild()) return messageFail(interaction, 'This comamnd is for servers only.');
  // check if user is teammember
  if (!interaction.member.roles.cache.has(config.teamRole)) return messageFail(interaction, 'You don\'t have access to this command! òwó');
  const subName = interaction.options.getSubcommand();
  client.commands.get(`${interaction.commandName}_${subName}`).run(interaction, moment, MessageEmbed);
};

module.exports.data = new CmdBuilder()
  .setName('nsfw')
  .setDescription('Manages nsfw access.')
  .addSubcommand((subcommand) => subcommand
    .setName('add')
    .setDescription('Adds an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to add.').setRequired(true))
    .addStringOption((option) => option.setName('date').setDescription('Provide the users DoB.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('change')
    .setDescription('Change the DoB of an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to add.').setRequired(true))
    .addStringOption((option) => option.setName('date').setDescription('Provide the users DoB.').setRequired(true)))
  .addSubcommand((subcommand) => subcommand
    .setName('search')
    .setDescription('Search an entry.')
    .addUserOption((option) => option.setName('user').setDescription('Provide a user to to add.').setRequired(true)));

// init Discord
const { Client, IntentsBitField, Collection } = require('discord.js');
// init file system
const fs = require('fs');
// init command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// use contructor to create intent bit field
const intents = new IntentsBitField(
  IntentsBitField.Flags.MessageContent,
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.GuildMembers,
  );

// setting essential global values; additional global values are set in the globalfunc.js file
// init Discord client
global.client = new Client({ disableEveryone: true, intents });
// init config 
global.config = require('./config.json');
global.config.package = require('./package.json');

global.DEBUG = process.env.NODE_ENV === 'development';

global.CmdBuilder = SlashCommandBuilder;

// global.LOG = (msg) => console.log(`[${SHARDID}] ${msg}`);

global.ERR = (err) => {
  console.error('ERROR:', err);
  if (DEBUG) return;
  const { EmbedBuilder } = require('discord.js');
  const embed = new EmbedBuilder()
    .setAuthor({ name: `Error: '${err.message}'` })
    .setDescription(`STACKTRACE:\n\`\`\`${err.stack.slice(0, 4000)}\`\`\``)
    .setColor('Red');
  client.channels.cache.get(config.logChannelID).send({ embeds: [embed] });
  return;
};

// creating collections and sets
client.commands = new Collection();
client.functions = new Collection();

// anouncing debug mode
if (DEBUG) console.log(`[${config.package.name}] Bot is on Debug-Mode. Some functions are not going to be loaded.`);

(async () => {
  // startup functions in order
  // const startupQueue = new PQueue({ concurrency: 1 });
  const files = await fs.readdirSync('./functions/STARTUP');
  files.forEach(async (FCN) => {
    if (!FCN.endsWith('.js')) return;
    const INIT = require(`./functions/STARTUP/${FCN}`);
    await INIT.run(fs);
  });

  // When done: Login the bot
  await client.login(process.env.token_discord);
})();

client.on('ready', async () => {
  // confirm user logged in
  console.log(`[${config.package.name}] Logged in as "${client.user.tag}"!`);

  // run setup functions
  config.setup.setupFunctions.forEach((FCN) => {
    client.functions.get(FCN).run();
  });
});

client.on('messageCreate', (message) => client.functions.get('EVENT_messageCreate').run(message));

// itneraction is triggered (command, autocomplete, etc.)
client.on('interactionCreate', (interaction) => client.functions.get('EVENT_interactionCreate').run(interaction));

// logging errors and warns
client.on('error', (ERR));
client.on('warn', (ERR));
process.on('uncaughtException', (ERR));

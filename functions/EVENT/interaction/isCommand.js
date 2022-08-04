const usedRecently = new Set();

function timeout(id, time) {
  usedRecently.add(id);
  setTimeout(() => usedRecently.delete(id), time);
}

module.exports.run = async (interaction) => {
  // debug protection
  // if (!DEBUG && interaction.commandName.includes('_dev')) return;
  // if (DEBUG && !interaction.commandName.includes('_dev')) return;

  const mainCMD = interaction.commandName;
  const command = client.commands.get(DEBUG ? mainCMD : interaction.commandName);
  if (command) {
    // if debuging trigger application thinking
    // TEMP: set to false to test some public commands
    // if (DEBUG) await interaction.deferReply();
    // rate limit commands
    const userID = interaction.member.id;
    if (usedRecently.has(userID)) return messageFail(interaction, 'Sorry, but you can\'t use me that often. Please wait 3 seconds between commands.');
    timeout(userID, 3000);
    command.run(interaction).catch(ERR);
    return;
  }
};

module.exports.data = {
  name: 'isCommand',
};

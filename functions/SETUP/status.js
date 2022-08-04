module.exports.run = async () => {
  if (DEBUG) return;
  return;
  console.log(`[${module.exports.data.name}] Setting status...`);
  await client.user.setStatus('online');
  await client.user.setActivity(`with ${client.users.cache.size}`, { type: 'PLAYING' });
  console.log(`[${module.exports.data.name}] Status set!`);
};

module.exports.data = {
  name: 'status',
  callOn: '-',
};

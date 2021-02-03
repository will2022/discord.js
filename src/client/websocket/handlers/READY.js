'use strict';

let ClientUser;

module.exports = (client, { d: data }, shard) => {
  if (client.user) {
    client.user._patch(data.user);
  } else {
    data.user.user_settings = data.user_settings;
	data.user.user_guild_settings = data.user_guild_settings;

    if (!ClientUser) ClientUser = require('../../../structures/ClientUser');
    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.users.cache.set(clientUser.id, clientUser);
  }

  for (const guild of data.guilds) {
    guild.shardID = shard.id;
    client.guilds.add(guild);
  }

  for (const relation of data.relationships) {
	const user = client.users.add(relation.user);
	if (relation.type === 1) {
	  client.user.friends.set(user.id, user);
	} else if (relation.type === 2) {
	  client.user.blocked.set(user.id, user);
	}
  }

  if (data.notes) {
	for (const user in data.notes) {
	  let note = data.notes[user];
	  if (!note.length) note = null;

	  client.user.notes.set(user, note);
	}
  }

  shard.checkReady();
};

// Gets Client and PermissionLevels from klasa
const { Client, PermissionLevels } = require('klasa');
const config = require('./config.json');

// Overrides default permission levels
const permissionLevels = new PermissionLevels()
    // Defines a default user with the least amount of permissions
    .addLevel(0, false, () => true)
    .addLevel(2, false, (client, msg) => msg.guild && msg.member.permissions.has('MANAGE_GUILD'))
    .addLevel(3, false, (client, msg) => msg.guild && msg.member.permissions.has('KICK_MEMBERS'))
    .addLevel(4, false, (client, msg) => msg.guild && msg.member.permissions.has('BAN_MEMBERS'))
    .addLevel(6, false, (client, msg) => msg.guild && msg.member.permissions.has('ADMINISTRATOR'))
    // These 2 levels define the bot owners permission levels
    .addLevel(9, true, (client, msg) => msg.author === client.owner)
    .addLevel(10, false, (client, msg) => msg.author === client.owner);

// Extends the client with our settings
class Posrednik extends Client {

    constructor() {
        super({
            clientOptions: {},
            prefix: 'p!',
            cmdPrompt: true,
            cmdEditing: true,
            // Grabs the newly set permission levels from up top
            permissionLevels
        });
    }

}

// Logs the account in
// noinspection JSIgnoredPromiseFromCall
new Posrednik().login(config.token);

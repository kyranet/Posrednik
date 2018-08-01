// Gets Client and PermissionLevels from klasa
const { Client, PermissionLevels } = require('klasa');
const config = require('./config.json');

// Overrides default permission levels
const permissionLevels = new PermissionLevels()
    // Defines a default user with the least amount of permissions
    .add(0, () => true)
    .add(2, (client, msg) => msg.guild && msg.member.permissions.has('MANAGE_GUILD'), { fetch: true })
    .add(3, (client, msg) => msg.guild && msg.member.permissions.has('KICK_MEMBERS'), { fetch: true })
    .add(4, (client, msg) => msg.guild && msg.member.permissions.has('BAN_MEMBERS'), { fetch: true })
    .add(6, (client, msg) => msg.guild && msg.member.permissions.has('ADMINISTRATOR'), { fetch: true })
    // These 2 levels define the bot owners permission levels
    .add(9, (client, msg) => msg.author === client.owner)
    .add(10, (client, msg) => msg.author === client.owner);

// Extends the client with our settings
class Posrednik extends Client {

    constructor() {
        super({
            clientOptions: {},
            prefix: 'p!',
            commandPrompt: true,
            commandEditing: true,
            // Grabs the newly set permission levels from up top
            permissionLevels
        });
        this.methods = { Embed: require('discord.js').MessageEmbed };
    }

}

// Logs the account in
// noinspection JSIgnoredPromiseFromCall
new Posrednik().login(config.token);

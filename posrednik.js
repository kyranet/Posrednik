// Gets Client and PermissionLevels from klasa
const { Client } = require('klasa');
const config = require('./config.json');

Client.defaultPermissionLevels
    .add(4, (client, msg) => msg.guild && msg.member.permissions.has('KICK_MEMBERS'), { fetch: true })
    .add(5, (client, msg) => msg.guild && msg.member.permissions.has('BAN_MEMBERS'), { fetch: true });

// Extends the client with our settings
class Posrednik extends Client {

    constructor() {
        super({
            prefix: 'p!',
            commandPrompt: true,
            commandEditing: true
        });
    }

}

// Logs the account in
// noinspection JSIgnoredPromiseFromCall
new Posrednik().login(config.token);

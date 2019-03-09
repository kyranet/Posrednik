// Gets Client and PermissionLevels from klasa
const { Client } = require('klasa');
const config = require('./config.json');

Client.defaultPermissionLevels
    .add(4, ({ guild, member }) => guild && member.permissions.has('KICK_MEMBERS'), { fetch: true })
    .add(5, ({ guild, member }) => guild && member.permissions.has('BAN_MEMBERS'), { fetch: true });
Client.defaultGuildSchema
    .add('channels', folder => folder
        .add('modlog', 'TextChannel')
        .add('announcementChannel', 'TextChannel'))
    .add('roles', folder => folder
        .add('announcementRole', 'Role'))
    .add('antiinvite', 'boolean', { default: false })
    .add('modlogs', 'any', { array: true });

new Client({
    prefix: 'p!',
    commandEditing: true
}).login(config.token);

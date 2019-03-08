const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'lockdown',
            permissionLevel: 4,
            requiredPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
            runIn: ['text'],
            description: language => language.get('COMMAND_LOCKDOWN_DESCRIPTION'),
            usage: '<channel:channel>'
        });
    }

    async run(msg, [channel]) {
        const locked = await this.handleLockdown(channel, channel.type === 'text' ? 'SEND_MESSAGES' : 'CONNECT');

        if (msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES') === false) return true;
        return msg.send(`${msg.language.get('COMMAND_LOCKDOWN_SUCCESSFULLY')} ${locked ? '' : 'un'}${msg.language.get('COMMAND_LOCKDOWN_LOCKED')} ${channel}`);
    }

    handleLockdown(channel, permission) {
        const permOverwrite = channel.permissionOverwrites.get(channel.guild.defaultRole.id);
        const locked = permOverwrite ? permOverwrite.denied.has(permission) : false;
        return channel.overwritePermissions(channel.guild.defaultRole, { [permission]: locked }, locked ? 'Lockdown released.' : 'Lockdown to prevent spam.')
            .then(() => !locked);
    }

};

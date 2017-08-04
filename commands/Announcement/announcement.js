const { Command } = require('klasa');
const announcement = require('../../util/announcement');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'announcement',
            permLevel: 2,
            runIn: ['text'],

            description: 'Send new announcements, mentioning the announcement role.',
            usage: '<string:string>',
            cooldown: 60
        });
    }

    async run(msg, [message]) {
        const announcementID = msg.guild.settings.announcementChannel;
        if (!announcementID) throw msg.language.get('COMMAND_SUBSCRIBE_NO_CHANNEL');
        const channel = msg.guild.channels.get(announcementID);
        if (!channel) throw msg.language.get('COMMAND_SUBSCRIBE_NO_CHANNEL');
        if (channel.postable === false) throw msg.language.get('SYSTEM_CHANNEL_NOT_POSTABLE');
        const role = announcement(msg);
        await role.edit({ mentionable: true });
        await channel.send(`${msg.language.get('COMMAND_ANNOUNCEMENT', role)}\n${message}`);
        await role.edit({ mentionable: false });
        return msg.send(msg.language.get('COMMAND_SUCCESS'));
    }

};

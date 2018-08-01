const { Command } = require('klasa');
const announcement = require('../../util/announcement');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'unsubscribe',
            permLevel: 0,
            runIn: ['text'],
            description: 'Unsubscribe to this servers\' announcements.',
            aliases: ['unsub', '-1']
        });
    }

    // This command just removes the set announcement subscriber role to the member

    async run(msg) {
        const role = announcement(msg);
        await msg.member.roles.remove(role);
        return msg.send(msg.language.get('COMMAND_UNSUBSCRIBE_SUCCESS', role.name));
    }

};

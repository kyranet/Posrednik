const { Command } = require('klasa');
const announcement = require('../../util/announcement');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'unsubscribe',
            permLevel: 0,
            runIn: ['text'],

            description: 'Unsubscribe to this servers\' announcements.'
        });
    }

    async run(msg) {
        const role = announcement(msg);
        await msg.member.removeRole(role);
        return msg.send(msg.language.get('COMMAND_UNSUBSCRIBE_SUCCESS', role.name));
    }

};

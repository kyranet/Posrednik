const { Command, util } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'history',
            permLevel: 0,
            runIn: ['text'],
            description: language => language.get('COMMAND_HISTORY_DESCRIPTION'),
            usage: '<user:user>'
        });
    }

    async run(msg, [user]) {
        const userlogs = msg.guild.settings.modlogs.filter(log => log.user === user.id);
        if (userlogs.length === 0) return msg.send(`${msg.language.get('COMMAND_HISTORY_NO')} ${user.tag} (${user.id}) ${msg.language.get('COMMAND_HISTORY_ACCOUNT')}`);
        const actions = {
            ban: 0,
            unban: 0,
            softban: 0,
            kick: 0,
            warn: 0
        };
        for (const log of userlogs) {
            actions[log.type]++;
        }
        return msg.send([
            `${msg.language.get('DEAR')} ${msg.author}, ${msg.language.get('COMMAND_HISTORY_THE_USER')} ${user.tag} (${user.id}) ${msg.language.get('COMMAND_HISTORY_LOGS')}`,
            util.codeBlock('http', Object.entries(actions).map(([action, value]) => `${util.toTitleCase(`${action}s`).padEnd(9)}: ${value}`).join('\n'))
        ]);
    }

};

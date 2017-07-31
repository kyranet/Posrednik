const { Command, util } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'history',
            permLevel: 2,
            runIn: ['text'],

            description: 'Check the history for the mentioned member.',
            usage: '<user:user>'
        });

        this.provider = null;
    }

    async run(msg, [user]) {
        const modlogs = await this.provider.get('modlogs', msg.guild.id).then(data => data || []);
        const userlogs = modlogs.filter(log => log.user.id === user.id);
        if (userlogs.length === 0) return msg.send(`There is no log under the ${user.tag} (${user.id}) account.`);
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
            `Dear ${msg.author}, the user ${user.tag} (${user.id}) has the following logs:`,
            util.codeBlock('http', Object.entries(actions).map(([action, value]) => `${util.toTitleCase(`${action}s`).padEnd(9)}: ${value}`).join('\n'))
        ]);
    }

    init() {
        this.provider = this.client.providers.get('json');
    }

};

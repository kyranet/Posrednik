const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'case',
            permLevel: 2,
            runIn: ['text'],

            description: 'Check a case.',
            usage: '<case:integer>'
        });

        this.provider = null;
    }

    async run(msg, [selected]) {
        const modlogs = await this.provider.get('modlogs', msg.guild.id).then(data => data || []);
        const log = modlogs[selected];
        if (!log) return msg.send(`I am sorry dear ${msg.author}, but there is no modlog under that case.`);
        return msg.send([
            `User      : ${log.user.tag} (${log.user.id})`,
            `Moderator : ${log.moderator.tag} (${log.moderator.id})`,
            `Reason    : ${log.reason || `No reason specified, write '${msg.guild.settings.prefix}reason ${selected}' to claim this log.`}`
        ], { code: 'http' });
    }

    init() {
        this.provider = this.client.providers.get('json');
    }

};

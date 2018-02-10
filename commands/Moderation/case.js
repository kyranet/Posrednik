const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'case',
            permLevel: 2,
            runIn: ['text'],

            description: (msg) => msg.language.get('COMMAND_CASE_DESCRIPTION'),
            usage: '<case:integer>'
        });

        this.provider = null;
    }

    async run(msg, [selected]) {
        const modlogs = await this.provider.get('modlogs', msg.guild.id).then(data => data || []);
        const log = modlogs[selected];
        if (!log) return msg.send(`${msg.language.get('COMMAND_CASE_SORRY')} ${msg.author}, ${msg.language.get('COMMAND_CASE_NO')}`);
        return msg.send([
            `User      : ${log.user.tag} (${log.user.id})`,
            `Moderator : ${log.moderator.tag} (${log.moderator.id})`,
            `Reason    : ${log.reason || `${msg.language.get('COMMAND_CASE_REASON')} '${msg.guild.configs.prefix}reason ${selected}' ${msg.language.get('COMMAND_CASE_CLAIM')}`}`
        ], { code: 'http' });
    }

    init() {
        this.provider = this.client.providers.get('json');
    }

};

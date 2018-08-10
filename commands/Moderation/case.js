const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'case',
            permLevel: 4,
            runIn: ['text'],
            description: language => language.get('COMMAND_CASE_DESCRIPTION'),
            usage: '<case:integer>'
        });
    }

    async run(msg, [selected]) {
        const log = msg.guild.settings.modlogs[selected];
        if (!log) return msg.send(`${msg.language.get('COMMAND_CASE_SORRY')} ${msg.author}, ${msg.language.get('COMMAND_CASE_NO')}`);

        const [user, moderator] = await Promise.all([
            this.client.users.fetch(log.user),
            this.client.users.fetch(log.moderator)
        ]);
        return msg.send([
            `User      : ${user.tag} (${user.id})`,
            `Moderator : ${moderator.tag} (${moderator.id})`,
            `Reason    : ${log.reason || `${msg.language.get('COMMAND_CASE_REASON')} '${msg.guild.settings.prefix}reason ${selected}' ${msg.language.get('COMMAND_CASE_CLAIM')}`}`
        ], { code: 'http' });
    }

};

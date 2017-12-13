const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'softban',
            permLevel: 4,
            botPerms: ['BAN_MEMBERS'],
            runIn: ['text'],

            description: (msg) => msg.language.get('COMMAND_SOFTBAN_DESCRIPTION'),
            usage: '<user:user> [reason:string] [...]',
            usageDelim: ' '
        });
    }

    async run(msg, [user, ...reason]) {
        reason = reason.length > 0 ? reason.join(' ') : null;

        const member = await msg.guild.members.fetch(user).catch(() => null);

        if (!member);
        else if (member.highestRole.position >= msg.member.highestRole.position) {
            return msg.send(`${msg.language.get('DEAR')} ${msg.author}, ${msg.language.get('POSITION')}`);
        } else if (member.bannable === false) {
            return msg.send(`${msg.language.get('DEAR')} ${msg.author}, ${msg.language.get('COMMAND_BAN_FAIL_BANNABLE')}`);
        }

        await msg.guild.ban(user, { reason, days: 1 });
        await msg.guild.unban(user, `${msg.language.get('COMMAND_SOFTBAN_AUDIT_REASON')}`);

        if (msg.guild.configs.modlog) {
            new ModLog(msg.guild)
                .setType('softban')
                .setModerator(msg.author)
                .setUser(user)
                .setReason(reason)
                .send();
        }

        return msg.send(`${msg.language.get('COMMAND_SOFTBAN_SUCCESSFULLY')} ${user.tag}${reason ? `\n${msg.language.get('REASON')}: ${reason}` : ''}`);
    }

};

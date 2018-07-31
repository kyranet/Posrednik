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
            usage: '<member:member> [reason:string] [...]',
            usageDelim: ' '
        });
    }

    async run(msg, [member, days = 1, ...reason]) {
        reason = reason.length > 0 ? reason.join(' ') : null;

        // noinspection StatementWithEmptyBodyJS
        if (!member);
        else if (member.roles.highest.position >= msg.member.roles.highest.position) {
            return msg.send(`${msg.language.get('DEAR')} ${msg.author}, ${msg.language.get('POSITION')}`);
        } else if (member.bannable === false) {
            return msg.send(`${msg.language.get('DEAR')} ${msg.author}, ${msg.language.get('COMMAND_BAN_FAIL_BANNABLE')}`);
        }

        await msg.guild.ban(member.id, { reason, days });
        await msg.guild.unban(member.id, `${msg.language.get('COMMAND_SOFTBAN_AUDIT_REASON')}`);

        if (msg.guild.configs.channels.modlog) {
            new ModLog(msg.guild)
                .setType('softban')
                .setModerator(msg.author)
                .setUser(member)
                .setReason(reason)
                .send();
        }

        return msg.send(`${msg.language.get('COMMAND_SOFTBAN_SUCCESSFULLY')} ${member.user.tag}${reason ? `\n${msg.language.get('REASON')}: ${reason}` : ''}`);
    }

};

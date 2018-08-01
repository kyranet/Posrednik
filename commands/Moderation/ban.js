const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ban',
            permLevel: 4,
            botPerms: ['BAN_MEMBERS'],
            runIn: ['text'],
            description: language => language.get('COMMAND_BAN_DESCRIPTION'),
            usage: '<user:user> [days:int{1,7}] [reason:string] [...]',
            usageDelim: ' '
        });
    }

    async run(msg, [user, days = 0, ...reason]) {
        reason = reason.length > 0 ? reason.join(' ') : null;

        const member = await msg.guild.members.fetch(user).catch(() => null);

        // noinspection StatementWithEmptyBodyJS
        if (!member);
        else if (member.roles.highest.position >= msg.member.roles.highest.position) {
            return msg.send(`${msg.language.get('DEAR')} ${msg.author}, ${msg.language.get('POSITION')}`);
        } else if (member.bannable === false) {
            return msg.send(`${msg.language.get('DEAR')} ${msg.author}, ${msg.language.get('COMMAND_BAN_FAIL_BANNABLE')}`);
        }

        await msg.guild.members.ban(user, { reason, days });

        if (msg.guild.configs.channels.modlog) {
            new ModLog(msg.guild)
                .setType('ban')
                .setModerator(msg.author)
                .setUser(user)
                .setReason(reason)
                .send();
        }

        return msg.send(`${msg.language.get('COMMAND_BAN_SUCCESS')} ${user.tag}${reason ? `\n${msg.language.get('REASON')}: ${reason}` : ''}`);
    }

};

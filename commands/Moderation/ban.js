const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ban',
            permLevel: 4,
            botPerms: ['BAN_MEMBERS'],
            runIn: ['text'],

            description: (msg) => msg.language.get('COMMAND_BAN_DESCRIPTION'),
            usage: '<user:user> [reason:string] [...]',
            usageDelim: ' '
        });
    }

    async run(msg, [user, ...reason]) {
        reason = reason.length > 0 ? reason.join(' ') : null;

        const member = await msg.guild.members.fetch(user).catch(() => null);

        // noinspection StatementWithEmptyBodyJS
        if (!member);
        else if (member.highestRole.position >= msg.member.highestRole.position) {
            return msg.send(`${msg.language.get('DEAR')} ${msg.author}, ${msg.language.get('POSITION')}`);
        } else if (member.bannable === false) {
            return msg.send(`${msg.language.get('DEAR')} ${msg.author}, ${msg.language.get('COMMAND_BAN_FAIL_BANNABLE')}`);
        }

        await msg.guild.ban(user, { reason });

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

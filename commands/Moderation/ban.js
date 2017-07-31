const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ban',
            permLevel: 2,
            botPerms: ['BAN_MEMBERS'],

            description: 'Bans the mentioned member.',
            usage: '<user:user> [reason:string] [...]',
            usageDelim: ' '
        });
    }

    async run(msg, [user, ...reason]) {
        reason = reason.length > 0 ? reason.join(' ') : null;

        const member = await msg.guild.fetchMember(user).catch(() => null);

        if (!member);
        else if (member.highestRole.position >= msg.member.highestRole.position) {
            return msg.send(`Dear ${msg.author}, you may not execute this command on this member.`);
        } else if (member.bannable === false) {
            return msg.send(`Dear ${msg.author}, I am not able to kick this member, sorry.`);
        }

        await msg.guild.ban(user, { reason });

        if (msg.guild.settings.modlog) {
            new ModLog(msg.guild)
                .setType('ban')
                .setModerator(msg.author)
                .setUser(user)
                .setReason(reason)
                .send();
        }

        return msg.send(`Successfully banned the member ${user.tag}${reason ? `\nWith reason of: ${reason}` : ''}`);
    }

};

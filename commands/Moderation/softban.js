const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'softban',
            permLevel: 2,
            botPerms: ['BAN_MEMBERS'],
            runIn: ['text'],

            description: 'Softbans the mentioned member.',
            usage: '<user:user> [reason:string] [...]',
            usageDelim: ' '
        });
    }

    async run(msg, [user, ...reason]) {
        reason = reason.length > 0 ? reason.join(' ') : null;

        const member = await msg.guild.members.fetch(user).catch(() => null);

        if (!member);
        else if (member.highestRole.position >= msg.member.highestRole.position) {
            return msg.send(`Dear ${msg.author}, you may not execute this command on this member.`);
        } else if (member.bannable === false) {
            return msg.send(`Dear ${msg.author}, I am not able to ban this member, sorry.`);
        }

        await msg.guild.ban(user, { reason, days: 1 });
        await msg.guild.unban(user, 'Softban process. Pruned one day worth of messages.');

        if (msg.guild.configs.modlog) {
            new ModLog(msg.guild)
                .setType('softban')
                .setModerator(msg.author)
                .setUser(user)
                .setReason(reason)
                .send();
        }

        return msg.send(`Successfully softbanned the member ${user.tag}${reason ? `\nWith reason of: ${reason}` : ''}`);
    }

};

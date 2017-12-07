const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'unban',
            permLevel: 2,
            botPerms: ['BAN_MEMBERS'],
            runIn: ['text'],

            description: 'Unbans the mentioned user.',
            usage: '<user:user> [reason:string] [...]',
            usageDelim: ' '
        });
    }

    async run(msg, [user, ...reason]) {
        reason = reason.length > 0 ? reason.join(' ') : null;

        const bans = await msg.guild.fetchBans();

        if (bans.has(user.id) === false) {
            return msg.send(`Dear ${msg.author}, this user is not banned.`);
        }

        await msg.guild.unban(user, reason);

        if (msg.guild.configs.modlog) {
            new ModLog(msg.guild)
                .setType('unban')
                .setModerator(msg.author)
                .setUser(user)
                .setReason(reason)
                .send();
        }

        return msg.send(`Successfully unbanned the member ${user.tag}${reason ? `\nWith reason of: ${reason}` : ''}`);
    }

};

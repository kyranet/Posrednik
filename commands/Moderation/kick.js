const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'kick',
            permLevel: 2,
            botPerms: ['KICK_MEMBERS'],
            runIn: ['text'],

            description: 'Kicks the mentioned member.',
            usage: '<user:member> [reason:string] [...]',
            usageDelim: ' '
        });
    }

    async run(msg, [member, ...reason]) {
        reason = reason.length > 0 ? reason.join(' ') : null;

        if (member.highestRole.position >= msg.member.highestRole.position) {
            return msg.send(`Dear ${msg.author}, you may not execute this command on this member.`);
        } else if (member.kickable === false) {
            return msg.send(`Dear ${msg.author}, I am not able to kick this member, sorry.`);
        }

        await member.kick(reason);

        if (msg.guild.configs.modlog) {
            new ModLog(msg.guild)
                .setType('kick')
                .setModerator(msg.author)
                .setUser(member.user)
                .setReason(reason)
                .send();
        }

        return msg.send(`Successfully kicked the member ${member.user.tag}${reason ? `\nWith reason of: ${reason}` : ''}`);
    }

};

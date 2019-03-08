const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'echo',
            permissionLevel: 2,
            runIn: ['text'],
            description: 'Send a message to a channel throught Posrednik.',
            usage: '[channel:channel] <message:string> [...]',
            usageDelim: ' '
        });
    }

    async run(msg, [channel = msg.channel, ...message]) {
        try {
            channel.sendMessage(message.join(' '));
        } catch (error) {
            throw msg.language('SYSTEM_CHANNEL_NOT_POSTABLE');
        }
    }

};

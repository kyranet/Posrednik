const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'echo',
            permLevel: 2,
            runIn: ['text'],

            description: 'Send a message to a channel throught Posrednik.',
            usage: '[channel:channel] <message:string> [...]',
            usageDelim: ' '
        });
    }

    async run(msg, [channel = msg.channel, ...message]) {
        if (channel.postable === false) throw msg.language('SYSTEM_CHANNEL_NOT_POSTABLE');
        return channel.send(message.join(' '));
    }

};

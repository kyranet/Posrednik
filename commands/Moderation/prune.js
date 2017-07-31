const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'prune',
            permLevel: 2,
            botPerms: ['MANAGE_MESSAGES'],

            description: 'Prunes a certain amount of messages w/o filter.',
            usage: '[limit:integer] [link|invite|bots|you|me|upload|user] [user:user]',
            usageDelim: ' '
        });
    }

    async run(msg, [limit = 50, filter = null, user = null]) {
        let messages = await msg.channel.fetchMessages({ limit });
        if (filter) {
            if (filter === 'user' && !user) return msg.send(`Dear ${msg.author}, you must specify a user with this filter.`);
            messages = messages.filter(this.getFilter(msg, filter, user));
        }
        await msg.channel.bulkDelete(messages);
        return msg.send(`Successfully deleted ${messages.size} messages from ${limit}.`);
    }

    getFilter(msg, filter, user) {
        switch (filter) {
            case 'link': return mes => /https?:\/\/[^ /.]+\.[^ /.]+/.test(mes.content);
            case 'invite': return mes => /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(mes.content);
            case 'bots': return mes => mes.author.bot;
            case 'you': return mes => mes.author.id === this.client.user.id;
            case 'me': return mes => mes.author.id === msg.author.id;
            case 'upload': return mes => mes.attachments.size > 0;
            case 'user': return mes => mes.author.id === user.id;
            default: return () => true;
        }
    }

};

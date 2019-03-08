const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'prune',
            permissionLevel: 4,
            requiredPermissions: ['MANAGE_MESSAGES'],
            runIn: ['text'],
            description: language => language.get('COMMAND_PRUNE_DESCRIPTION'),
            usage: '[limit:integer] [link|invite|bots|you|me|upload|user:user]',
            usageDelim: ' '
        });
    }

    async run(msg, [limit = 50, filter = null]) {
        let messages = await msg.channel.messages.fetch({ limit: 100 });
        if (filter) {
            const user = typeof filter !== 'string' ? filter : null;
            const type = typeof filter === 'string' ? filter : 'user';
            messages = messages.filter(this.getFilter(msg, type, user));
        }
        messages = messages.array().slice(0, limit);
        await msg.channel.bulkDelete(messages);
        return msg.send(`${msg.language.get('COMMAND_PRUNE_SUCCESSFULLY')} ${messages.length} ${msg.language.get('COMMAND_PRUNE_MESSAGES')} ${limit}.`);
    }

    getFilter(msg, filter, user) {
        switch (filter) {
            // Here we use Regex to check for the diffrent types of prune options
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

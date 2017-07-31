const { Command, util } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'reason',
            permLevel: 2,
            runIn: ['text'],
            requiredSettings: ['modlog'],

            description: 'Edit the reason field from a case.',
            usage: '<case:integer> <reason:string> [...]',
            usageDelim: ' '
        });

        this.provider = null;
    }

    async run(msg, [selected, ...reason]) {
        reason = reason.length > 0 ? reason.join(' ') : null;

        const modlogs = await this.provider.get('modlogs', msg.guild.id).then(data => data || []);
        const log = modlogs[selected];
        if (!log) return msg.send(`I am sorry dear ${msg.author}, but there is no modlog under that case.`);

        const channel = msg.guild.channels.get(msg.guild.settings.modlog);
        if (!channel) return msg.send('The modlog channel does not exist, did it get deleted?');

        const messages = await channel.fetchMessages({ limit: 100 });
        const message = messages.find(mes => mes.author.id === this.client.user.id &&
            mes.embeds.length > 0 &&
            mes.embeds[0].type === 'rich' &&
            mes.embeds[0].footer && mes.embeds[0].footer.text === `Case ${selected}`
        );

        if (message) {
            const embed = message.embeds[0];
            const [type, user] = embed.description.split('\n');
            embed.description = [
                type,
                user,
                `**Reason**: ${reason}`
            ].join('\n');
            await message.edit({ embed });
        } else {
            const embed = new this.client.methods.Embed()
                .setAuthor(log.moderator.tag)
                .setColor(ModLog.colour(log.type))
                .setDescription([
                    `**Type**: ${log.type}`,
                    `**User**: ${log.user.tag} (${log.user.id})`,
                    `**Reason**: ${reason}`
                ])
                .setFooter(`Case ${selected}`)
                .setTimestamp();
            await channel.send({ embed });
        }

        const oldReason = log.reason;

        modlogs[selected].reason = reason;
        await this.provider.replace('modlogs', msg.guild.id, modlogs);

        return msg.send(`Successfully updated the log ${selected}.${util.codeBlock('http', [
            `Old reason : ${oldReason || 'Not set.'}`,
            `New reason : ${reason}`
        ].join('\n'))}`);
    }

    init() {
        this.provider = this.client.providers.get('json');
    }

};

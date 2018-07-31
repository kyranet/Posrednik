const { Command, util } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'reason',
            permLevel: 2,
            runIn: ['text'],
            requiredSettings: ['modlog'],

            description: (msg) => msg.language.get('COMMAND_REASON_DESCRIPTION'),
            usage: '<case:integer> <reason:string> [...]',
            usageDelim: ' '
        });

        this.provider = null;
    }

    async run(msg, [selected, ...reason]) {
        reason = reason.length > 0 ? reason.join(' ') : null;

        const modlogs = msg.guild.configs.modlogs;
        const log = modlogs[selected];

        if (!log) return msg.send(`${msg.language.get('SORRY_DEAR')} ${msg.author}, ${msg.language.get('COMMAND_REASON_CASE')}`);

        const channel = msg.guild.channels.get(msg.guild.configs.channels.modlog);
        if (!channel) return msg.send(`${msg.language.get('COMMAND_REASON_MODLOG')}`);

        const messages = await channel.messages.fetch({ limit: 100 });
        const message = messages.find(mes => mes.author.id === this.client.user.id &&
            mes.embeds.length > 0 &&
            mes.embeds[0].type === 'rich' &&
            mes.embeds[0].footer && mes.embeds[0].footer.text === `${msg.language.get('CASE')} ${selected}`
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
        await msg.guild.configs.update('modlogs', modlogs);

        return msg.send(`${msg.language.get('COMMAND_REASON_SUCCESS')} ${selected}.${util.codeBlock('http', [
            `Old reason : ${oldReason || 'Not set.'}`,
            `New reason : ${reason}`
        ].join('\n'))}`);
    }

    init() {
        this.provider = this.client.providers.default;
    }

};

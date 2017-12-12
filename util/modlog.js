module.exports = class ModLog {

    constructor(guild) {
        this.guild = guild;
        this.client = guild.client;

        this.type = null;
        this.user = null;
        this.moderator = null;
        this.reason = null;

        this.case = null;
    }

    setType(type) {
        this.type = type;
        return this;
    }

    setUser(user) {
        this.user = {
            id: user.id,
            tag: user.tag
        };
        return this;
    }

    setModerator(user) {
        this.moderator = {
            id: user.id,
            tag: user.tag,
            avatar: user.displayAvatarURL()
        };
        return this;
    }

    setReason(reason = null) {
        if (reason instanceof Array) reason = reason.join(' ');
        this.reason = reason;
        return this;
    }

    async send() {
        const channel = this.guild.channels.get(this.guild.configs.modlog);
        if (!channel) throw 'The modlog channel does not exist, did it get deleted?';
        this.case = await this.getCase();
        return channel.send({ embed: this.embed });
    }

    get embed() {
        const embed = new this.client.methods.Embed()
            .setAuthor(this.moderator.tag, this.moderator.avatar)
            .setColor(ModLog.colour(this.type))
            .setDescription([
                `**Type**: ${this.type}`,
                `**User**: ${this.user.tag} (${this.user.id})`,
                `**Reason**: ${this.reason || `Use \`${this.guild.configs.prefix}reason ${this.case} to claim this log.\``}`
            ])
            .setFooter(`Case ${this.case}`)
            .setTimestamp();
        return embed;
    }

    async getCase() {
        const modlogs = await this.provider.get('modlogs', this.guild.id);
        if (!modlogs) return this.provider.create('modlogs', this.guild.id, [this.pack]).then(() => 0);
        modlogs.push(this.pack);
        await this.provider.replace('modlogs', this.guild.id, modlogs);
        return modlogs.length - 1;
    }

    get pack() {
        return {
            type: this.type,
            user: {
                id: this.user.id,
                tag: this.user.tag
            },
            moderator: this.moderator,
            reason: this.reason,
            case: this.case
        };
    }

    get provider() {
        return this.client.providers.get('json');
    }

    static colour(type) {
        switch (type) {
            case 'ban': return 16724253;
            case 'unban': return 1822618;
            case 'warn': return 16564545;
            case 'kick': return 16573465;
            case 'softban': return 15014476;
            default: return 16777215;
        }
    }

};

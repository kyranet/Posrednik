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

    // Here we get all the info about the executing Moderator

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

    // Checks if the modlog channel still exsists if not it throws an error to the console

    async send() {
        const channel = this.guild.channels.get(this.guild.configs.channels.modlog);
        if (!channel) throw 'The modlog channel does not exist, did it get deleted?';
        await this.getCase();
        return channel.send({ embed: this.embed });
    }

    // Here we build the modlog embed

    get embed() {
        const embed = new this.client.methods.Embed()
            .setAuthor(this.moderator.tag, this.moderator.avatar)
            .setColor(ModLog.colour(this.type))
            .setDescription([
                `**Type**: ${this.type}`,
                `**User**: ${this.user.tag} (${this.user.id})`,
                `**Reason**: ${this.reason || `Use \`${this.guild.configs.prefix}reason ${this.case}\` to claim this log.`}`
            ])
            .setFooter(`Case ${this.case}`)
            .setTimestamp();
        return embed;
    }

    // Here we get the case number and create a modlog provider entry

    async getCase() {
        const { modlogs } = this.guild.configs;
        this.case = modlogs.length || 0;
        modlogs.push(this.pack);
        await this.guild.configs.update(['modlogs'], [modlogs]);
    }
    // Here we pack all the info together

    get pack() {
        return {
            type: this.type,
            user: this.user.id,
            moderator: this.moderator.id,
            reason: this.reason,
            case: this.case
        };
    }

    // Here we get the provider type. Meaning how it will store the internal entry

    get provider() {
        return this.client.providers.default;
    }

    // And here we just define the color for a certain type of offence or action

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

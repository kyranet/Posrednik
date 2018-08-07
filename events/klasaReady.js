const { Event } = require('klasa'); // eslint-disable-line no-unused-vars

module.exports = class extends Event {

    constructor(...args) {
        super(...args, { once: true });
    }

    async run() {
        //
    }

    async init() {
        // Folders
        if (!this.client.gateways.guilds.schema.has('channels')) await this.client.gateways.guilds.schema.add('channels', {});
        if (!this.client.gateways.guilds.schema.has('roles')) await this.client.gateways.guilds.schema.add('roles', {});
        // Values
        if (!this.client.gateways.guilds.schema.has('antiinvite')) await this.client.gateways.guilds.schema.add('antiinvite', { type: 'boolean', default: false });
        if (!this.client.gateways.guilds.schema.has('modlogs')) await this.client.gateways.guilds.schema.add('modlogs', { type: 'any', array: true });
        // Channels
        if (!this.client.gateways.guilds.schema.channels.has('modlog')) await this.client.gateways.guilds.schema.channels.add('modlog', { type: 'TextChannel' });
        if (!this.client.gateways.guilds.schema.channels.has('announcementChannel')) await this.client.gateways.guilds.schema.channels.add('announcementChannel', { type: 'TextChannel' });
        // Roles
        if (!this.client.gateways.guilds.schema.roles.has('announcementRole')) await this.client.gateways.guilds.schema.roles.add('announcementRole', { type: 'Role' });
    }

};

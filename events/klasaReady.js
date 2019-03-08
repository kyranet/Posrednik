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
        if (!this.client.gateways.guilds.schema.has('channels')) await this.client.gateways.guilds.schema.add('channels', async folder => {
            // Channels
            if (!folder.has('modlog')) await folder.add('modlog', 'TextChannel');
            if (!folder.has('announcementChannel')) await folder.add('announcementChannel', 'TextChannel');
        });
        if (!this.client.gateways.guilds.schema.has('roles')) await this.client.gateways.guilds.schema.add('roles', async folder => {
            // Roles
            if (!folder.has('announcementRole')) await folder.add('announcementRole', 'Role');
        });
        // Values
        if (!this.client.gateways.guilds.schema.has('antiinvite')) await this.client.gateways.guilds.schema.add('antiinvite', 'boolean', { default: false });
        if (!this.client.gateways.guilds.schema.has('modlogs')) await this.client.gateways.guilds.schema.add('modlogs', 'any', { array: true });
    }

};

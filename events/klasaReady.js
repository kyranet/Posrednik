const { Event } = require('klasa'); // eslint-disable-line no-unused-vars

module.exports = class extends Event {

    constructor(...args) {
        super(...args, { once: true });
    }

    async run() {
        //
    }

    async init() {
        const { schema } = this.client.gateways.guilds;
        // Folders
        if (!schema.has('channels')) await schema.add('channels', {});
        if (!schema.has('roles')) await schema.add('roles', {});
        // Values
        if (!schema.has('antiinvite')) await schema.add('antiinvite', { type: 'boolean', default: false });
        if (!schema.has('modlogs')) await schema.add('modlogs', { type: 'any', array: true });
        // Channels
        if (!schema.channels.has('modlog')) await schema.channels.add('modlog', { type: 'TextChannel' });
        if (!schema.channels.has('announcementChannel')) await schema.channels.add('announcementChannel', { type: 'TextChannel' });
        // Roles
        if (!schema.roles.has('announcementRole')) await schema.roles.add('announcementRole', { type: 'Role' });
    }

};

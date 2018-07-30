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
        // Values
        if (!schema.has('antiinvite')) await schema.add('antiinvite', { type: 'boolean', default: false });
        if (!schema.has('modlogs')) await schema.add('modlogs', { type: 'any', array: true });
        // Channels
        if (!schema.channels.has('modlog')) await schema.channels.add('modlog', { type: 'TextChannel' });
    }

};

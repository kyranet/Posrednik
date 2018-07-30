const { Monitor } = require('klasa');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            name: 'antiinvite',
            enabled: true,
            ignoreSelf: true
        });
    }

    run(msg) {
        // If the channel type isnt "text" or the antiinvite config is set to false it returns
        if (msg.channel.type !== 'text' || msg.guild.configs.antiinvite !== true) return null;
        // Here it uses regex to determine if the message is a invite or not, if its not it returns
        if (!/(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(msg.content)) return null;
        // If it is a invite it deletes it
        return msg.delete()
            .catch(err => this.client.emit('log', err, 'error'));
    }

    // Here it add the settings key to the guild if its not already present in the schema
    async init() {
        if (!this.client.gateways.guilds.schema.has('antiinvite')) {
            return this.client.gateways.guilds.schema.add('antiinvite', { type: 'Boolean', default: false });
        }
        return null;
    }

};

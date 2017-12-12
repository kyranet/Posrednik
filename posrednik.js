const klasa = require('klasa');
const config = require('./config.json');

const client = new klasa.Client({
    clientOptions: {},
    config: require('./config.json'),
    prefix: 'p!',
    cmdPrompt: true,
    cmdEditing: true
});

client.login(config.token);

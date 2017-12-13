const klasa = require('klasa');
const config = require('./config.json');

const client = new klasa.Client({
    clientOptions: {},
    prefix: 'p!',
    cmdPrompt: true,
    cmdEditing: true
});

client.login(config.token);

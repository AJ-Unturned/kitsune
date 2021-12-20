import kClient from './structures/kClient';
import { token, mongo } from '../config.json';

const client: kClient = new kClient({
    intents: [
        'GUILDS', 'GUILD_MESSAGES', 'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_INVITES', 'GUILD_BANS', 'GUILD_WEBHOOKS',
        'GUILD_MEMBERS', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES',
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    ws: {
        properties: {
            $browser: 'Discord IOS'
        }
    }
}, {
    mongo: {
        enabled: true,
        username: mongo.username,
        password: mongo.password,
        uri: mongo.uri
    }
});

client.init(token);

export default client;
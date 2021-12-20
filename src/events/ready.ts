import kClient from '../structures/kClient';

export = (client: kClient) =>
{
    client.user?.setActivity('over ' + client.guilds.cache.size + ' servers', { type: 'WATCHING' });
    console.log(`${ client.user?.tag } is ready!`);
};
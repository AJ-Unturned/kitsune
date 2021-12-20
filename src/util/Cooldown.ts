import { GuildMember, User } from 'discord.js';
import client from '../index';

const Cooldown = (user: GuildMember | User, time: number): Promise<boolean> =>
{
    const cooldown = client.cooldowns.get(user.id);

    if(!cooldown)
    {
        client.cooldowns.set(user.id, time);
        
        setTimeout(() =>
        {
            client.cooldowns.delete(user.id);
        }, time);

        return Promise.resolve(false);
    }
    else
    {
        return Promise.resolve(true);
    }
};

export default Cooldown;
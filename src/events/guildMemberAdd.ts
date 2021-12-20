import { GuildMember } from 'discord.js';
import { User } from '../structures/schemas/User';
import kClient from '../structures/kClient';

export = (_client: kClient, member: GuildMember) =>
{
    User.findOne({ userID: member.id }, ((err: any, user: any) =>
    {
        if (err) return;
        if (!user)
        {
            const newUser = new User({ userID: member.id, balance: 0 });
            return newUser.save();
        }

        // User already exists within the database, so no reason to do anything.
        return;
    }))
};
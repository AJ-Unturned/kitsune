import { GuildMember, TextChannel } from 'discord.js';
import { User } from '../structures/schemas/User';
import { welcomechannel as WelcomeChannelID } from '../../config.json';
import kClient from '../structures/kClient';

export = (client: kClient, member: GuildMember) =>
{
    User.findOne({ userID: member.id }, ((err: any, user: any) =>
    {
        if(err) return;
        if(!user)
        {
            const newUser = new User({ userID: member.id, balance: 0 });
            return newUser.save();
        }

        // User already exists within the database, so no reason to do anything.
        return;
    }));

    const welcomeChannel = client.channels.cache.get(WelcomeChannelID) as any as TextChannel; 

    if(!welcomeChannel)
        return;

    return welcomeChannel.send({
        embeds: [
            {
                title: 'Member Joined!',
                description:
                    `
            Welcome ${ member } to the server!
            • **ID:** ${ member.id }
            • **Username:** ${ member.user.username }
            • **Time:** ${ new Date().toLocaleString() }
            `,
                footer: {
                    text: '©️ 2019-2021 AJ Unturned',
                },
                timestamp: new Date()
            }
        ]
    });
};
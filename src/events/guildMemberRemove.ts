import { GuildMember, TextChannel } from 'discord.js';
import { welcomechannel as WelcomeChannelID } from '../../config.json';
import kClient from '../structures/kClient';

export = (client: kClient, member: GuildMember) =>
{
    const welcomeChannel = client.channels.cache.get(WelcomeChannelID) as any as TextChannel;

    if(!welcomeChannel)
        return;

    return welcomeChannel.send({
        embeds: [
            {
                title: 'Member Left!',
                description:
                    `
            ${ member } has left the server!
            • **ID:** ${ member.id }
            • **Username:** ${ member.user.username }
            • **Time:** ${ new Date().toLocaleString() }
            • **Joined at:** ${ member.joinedAt!.toLocaleString() }
            `,
                footer: {
                    text: '©️ 2019-2021 AJ Unturned',
                },
                timestamp: new Date()
            }
        ]
    });
};
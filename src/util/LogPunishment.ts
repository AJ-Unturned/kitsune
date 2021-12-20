/* eslint-disable no-unused-vars */
import { CommandInteraction, GuildMember, TextChannel } from 'discord.js';
import { logchannel } from '../../config.json';

enum PunishmentType
{
    Ban,
    Kick
}

const LogPunish = (interaction: CommandInteraction, member: GuildMember, type: PunishmentType) =>
{
    const channel = interaction.guild!.channels.cache.get(logchannel) as any as TextChannel;

    channel.send({
        embeds: [
            {
                title: interaction.user.tag + '(' + interaction.user.id + ')',
                description: `**Member:** \`${ member.user.tag }\`\n**Action:** ${ type.toString() }\n**Reason:** ${ interaction.options.getString('reason') ?? 'No reason provided.' }`,
            }
        ]
    });
};

export default LogPunish;

export
{
    LogPunish,
    PunishmentType
};
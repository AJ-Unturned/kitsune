import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { ExecuteFunction } from '../../structures/Command';

export const data = new SlashCommandBuilder()
    .setName('information')
    .setDescription('Get information about the guild or user.')
    .addSubcommand(subcmd =>
        subcmd.setName('guild')
            .setDescription('Get the information about the guild.')
    )
    .addSubcommand(subcmd =>
        subcmd.setName('user')
            .setDescription('Get the information about the user.')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('The user to get information about.')
                    .setRequired(false)
            )
    );

export const execute: ExecuteFunction = async (interaction: CommandInteraction) =>
{
    if(!interaction.guild)
        return interaction.reply('You must be in a guild to use this command.');

    switch(interaction.options.getSubcommand())
    {
        case 'guild':
            {
                return interaction.reply({
                    embeds: [
                        {
                            title: 'Guild information',
                            description:
                                `
                    **Name:** \`${ interaction.guild!.name }\`
                    **ID:** \`${ interaction.guild!.id }\`
                    **Owner:** \`<@${ interaction.guild!.ownerId }>\`
                    **Members:** \`${ interaction.guild!.memberCount }\`
                    **Channels:** \`${ interaction.guild!.channels.cache.size }\`
                    **Roles:** \`${ interaction.guild!.roles.cache.size }\`
                    **Emojis:** \`${ interaction.guild!.emojis.cache.size }\`
                    **Verification Level:** \`${ interaction.guild!.verificationLevel }\`
                    **Explicit Content Filter:** \`${ interaction.guild!.explicitContentFilter }\`
                    **Default Message Notification Level:** \`${ interaction.guild!.defaultMessageNotifications }\`
                    **Explicit Content Filter:** \`${ interaction.guild!.explicitContentFilter }\`
                    `
                        }
                    ]
                });
            }
        case 'user':
            {
                const member = await interaction.guild!.members.fetch(interaction.options.getUser('user')!);

                if(!member)
                    return interaction.reply('Could not find that user.');

                return interaction.reply({
                    embeds: [
                        {
                            title: 'User information',
                            description:
                                `
                    **Name:** \`${ member.user.username }\`
                    **ID:** \`${ member.user.id }\`
                    **Nickname:** \`${ member.nickname ?? 'No nickname' }\`
                    **Joined:** \`${ member.joinedAt }\`
                    **Roles:** \`${ member.roles.cache.size }\`
                    **Bot:** \`${ member.user.bot }\`
                    **Avatar:** ${ member.user.avatarURL() }
                    `

                        }
                    ]
                });
            }

    }
};
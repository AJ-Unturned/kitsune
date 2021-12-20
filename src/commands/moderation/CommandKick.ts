import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import LogPunishment, { PunishmentType } from '../../util/LogPunishment';
import { ExecuteFunction } from '../../structures/Command';

export const data = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user.')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to ban.')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('reason')
            .setDescription('The reason for the ban.')
            .setRequired(false)
    );

export const execute: ExecuteFunction = async (interaction: CommandInteraction) =>
{
    if(!interaction.guild)
        return interaction.reply({ content: 'You must be in a server to use this command.', ephemeral: true });

    if(!interaction.memberPermissions?.has(Permissions.FLAGS.KICK_MEMBERS))
        return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });

    const member = await interaction.guild.members.fetch(interaction.options.getUser('user')!);

    if(!member)
        return interaction.reply({ content: 'Could not find that user.', ephemeral: true });

    if(member.id === interaction.client.user!.id)
        return interaction.reply({ content: 'You cannot ban me!', ephemeral: true });

    if(!member.bannable)
        return interaction.reply({ content: 'I do not have permission to ban that user.', ephemeral: true });

    await member.kick('Kicked  by ' + interaction.user.tag + '\nReason:' + interaction.options.getString('reason') ?? 'No reason provided.');
    
    LogPunishment(interaction, member, PunishmentType.Kick);

    return interaction.reply({ content: 'Kicked **' + member.user.tag + '**.' });
};
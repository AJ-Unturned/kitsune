import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Permissions } from 'discord.js';
import { ExecuteFunction } from '../../structures/Command';

export const data = new SlashCommandBuilder()
    .setName('status')
    .setDescription('Change the status of the Discord bot.')
    .addStringOption(subcmd =>
        subcmd.setName('content')
            .setDescription('The status to change to.')
            .setRequired(false)
    )
    .addStringOption(subcmd =>
        subcmd.setName('type')
            .setDescription('The type of status to change to.')
            .setRequired(false)
    );

export const execute: ExecuteFunction = async (interaction: CommandInteraction) =>
{
    if(!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR))
        return interaction.reply('You do not have permission to change the status of the bot.');

    if(interaction.options.getString('content'))
    {
        if(interaction.options.getString('type'))
        {
            interaction.client.user?.setActivity(interaction.options.getString('content') as any as string, { type: interaction.options.getString('type') as any ?? 'PLAYING' });
            return interaction.reply('Set the status to `' + interaction.options.getString('content') + '`, with type of `' + interaction.options.getString('type') + '`.');
        }
        else
        {
            interaction.client.user?.setActivity(interaction.options.getString('content') as any as string);
            return interaction.reply('Set the status to `' + interaction.options.getString('content') + '`.');
        }
    }

    return;
};
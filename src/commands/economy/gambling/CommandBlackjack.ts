import { ExecuteFunction } from '../../../structures/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('Blackjack! 21 bb')
    .addNumberOption(option =>
        option.setName('bet')
            .setDescription('The amount of kats to bet on the blackjack game.')
            .setRequired(true)
    );

export const execute: ExecuteFunction = async (interaction: CommandInteraction) =>
{
    interaction.reply({ embeds: [{ description: 'Uh oh! Not implemented.' }] });
};
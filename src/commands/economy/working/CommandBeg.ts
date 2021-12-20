import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ExecuteFunction } from 'src/structures/Command';
import { User } from '../../../structures/schemas/User';
import CreateUserAccount from '../../../util/CreateUserAccount';

export const data = new SlashCommandBuilder()
    .setName('beg')
    .setDescription('Beg for money.');

export const execute: ExecuteFunction = async (interaction: CommandInteraction) =>
{
    const userData = await User.findOne({ userID: interaction.user.id });

    if(!userData)
        CreateUserAccount(interaction.user);
    
    const amount: number = Math.floor(Math.random() * (200 - 50) + 50);
    
    userData.balance += amount;
    userData.save();

    return interaction.reply({
        embeds: [
            {
                title: 'You begged and got ' + amount + ' kats!',
                footer: {
                    text: 'You begged for money, you rat.',
                }
            }
        ]
    });
};
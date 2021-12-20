import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { User } from '../structures/schemas/User';
import { ExecuteFunction } from '../structures/Command';

export const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the leaderboard.')
    .addSubcommand(subcmd =>
        subcmd.setName('levels')
            .setDescription('View the leaderboard for levels.')
    )
    .addSubcommand(subcmd =>
        subcmd.setName('kats')
            .setDescription('View the leaderboard for kats.')
    );

export const execute: ExecuteFunction = async (interaction: CommandInteraction) =>
{
    switch(interaction.options.getSubcommand())
    {
        case 'levels':
            return interaction.reply('Uh oh! This hasn\'t been implemented yet.');
        case 'kats':
            return User.find({}).sort({ balance: -1 }).limit(10).then(users =>
            {
                let userMessage: string = '';

                for(let i: number = 0; i < users.length; i++)
                    userMessage = userMessage.concat(`**${ i + 1 }.** <@${ users[i].userID }> - ${ users[i].balance } Kats\n`);

                const embed = new MessageEmbed()
                    .setTitle('Kat Leaderboard')
                    .setDescription('Top 10 users by Kats.\n- - -\n' + userMessage);

                return interaction.reply({ embeds: [embed] });
            });
    }
};
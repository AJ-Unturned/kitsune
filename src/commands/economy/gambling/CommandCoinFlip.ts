import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ExecuteFunction } from '../../../structures/Command';
import { User } from '../../../structures/schemas/User';
import CreateUserAccount from '../../../util/CreateUserAccount';
import Cooldown from '../../../util/Cooldown';

export const data = new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('50/50 chance of winning, heads or tails!')
    .addStringOption(option =>
        option.setName('side')
            .setDescription('What side of the coin to bet on.')
            .setRequired(true)
            .addChoice('heads', 'heads')
            .addChoice('tails', 'tails')
    )
    .addIntegerOption(option =>
        option.setName('bet')
            .setDescription('The amount of kats to bet.')
            .setRequired(false)
    );

export const execute: ExecuteFunction = async (interaction: CommandInteraction) =>
{
    const cooldown = await Cooldown(interaction.user, 5000);
    if(cooldown)
    {
        interaction.reply('You are currently on cooldown, try again in a little bit.');
        return;
    }

    const side = interaction.options.getString('side');
    const bet = interaction.options.getInteger('bet') ?? 0;

    const user = await User.findOne({ userID: interaction.user.id });

    if(!user)
        CreateUserAccount(user);

    if(user.balance < bet)
        return interaction.reply('You do not have enough kats to bet that much!');

    const flip: 'heads' | 'tails' = Math.round(Math.random()) > 0.5 ? 'heads' : 'tails';

    if(flip === side)
    {
        if(bet <= 0)
            return interaction.reply(`The coin landed on ${ flip }! You won no kats, try betting next time!`);

        user.balance += bet * 2;
        await user.save();
        return interaction.reply(`The coin landed on ${ flip } You won ${ bet * 2 } kats!`);
    }
    else
    {
        if(bet <= 0)
            return interaction.reply(`The coin landed on ${ flip }! You lost no kats, try betting next time!`);

        user.balance -= bet;
        await user.save();
        return interaction.reply(`The coin landed on ${ flip }! You lost ${ bet } kats!`);
    }
};
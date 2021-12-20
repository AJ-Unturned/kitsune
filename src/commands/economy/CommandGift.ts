import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ExecuteFunction } from '../../structures/Command';
import { User } from '../../structures/schemas/User';
import CreateUserAccount from '../../util/CreateUserAccount';

export const data = new SlashCommandBuilder()
    .setName('gift')
    .setDescription('Randomly gift some money!')
    .addIntegerOption(option =>
        option.setName('amount')
            .setDescription('The amount of Kats to give away.')
            .setRequired(false)
    );

export const execute: ExecuteFunction = async (interaction: CommandInteraction) =>
{
    const userData = await User.findOne({ userId: interaction.user.id });
    let amount: number | null = interaction.options.getInteger('amount');

    if (!userData)
        CreateUserAccount(interaction.user);
        
    if(!amount || amount < 1)
        // Limits the amount of Kats that will be gifted (randomly) if none is provided.
        amount = Math.floor(Math.random() * (userData.balance / 3) + 1);

    if(!interaction.guild)
        return interaction.reply({ content: 'You must be in a server to use this command.', ephemeral: true });

    if(userData.balance < amount)
        return interaction.reply({ content: 'You do not have enough Kats.', ephemeral: true });

    const member = await getRandomUser(interaction);
    if(!member)
        return interaction.reply({ content: 'Could not find a user to randomly gift to, weird. Try again!', ephemeral: true });

    const memberData = await User.findOne({ userId: member.user.id });

    if(!memberData)
        CreateUserAccount(member.user);

    userData.balance -= amount;
    memberData.balance += amount;

    await userData.save();
    await memberData.save();

    return interaction.reply({
        embeds: [{
            title: 'Random Gift',
            description: `You gifted ${ amount } Kats to ${ member.user.tag }!`
        }]
    });
};

function getRandomUser(interaction: CommandInteraction): Promise<GuildMember>
{
    return new Promise<GuildMember>((resolve) =>
    {
        let member: GuildMember | undefined = interaction.guild!.members.cache.random();

        if(!member || typeof member === 'undefined')
            getRandomUser(interaction);

        if(member!.user.id === interaction.user.id)
            member = interaction.guild!.members.cache.random();

        resolve(member as any as GuildMember);
    });
}
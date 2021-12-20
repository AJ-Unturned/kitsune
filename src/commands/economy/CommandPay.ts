import { ExecuteFunction } from '../../structures/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import { User } from '../../structures/schemas/User';
import { CommandInteraction, MessageActionRow, MessageButton, User as dUser } from 'discord.js';
import CreateUserAccount from '../../util/CreateUserAccount';

export const data = new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Transfer your kats to another person.')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to transfer to.')
            .setRequired(true)
    )
    .addNumberOption(option =>
        option.setName('amount')
            .setDescription('The amount of kats to transfer.')
            .setRequired(true)
    );



export const execute: ExecuteFunction = async (interaction: CommandInteraction) =>
{
    if(!interaction.channel)
        return interaction.reply({ content: 'You can\'t use this command in a DM!', ephemeral: true });

    const user: dUser | null = interaction.options.getUser('user');
    const amount: number | null = interaction.options.getNumber('amount');

    if(!user || !amount)
        return interaction.reply({ content: 'You must specify a user and an amount!', ephemeral: true });

    if(user.id === interaction.user.id)
        return interaction.reply({ content: 'You cannot pay yourself!', ephemeral: true });

    const userData = await User.findOne({ userID: interaction.user.id });
    const targetData = await User.findOne({ userID: user.id });

    if(!userData)
        CreateUserAccount(interaction.user);

    if(!targetData)
        CreateUserAccount(user);

    if(amount > userData.balance)
        return interaction.reply({ content: 'You do not have enough kats!', ephemeral: true });

    await handlePay(interaction, amount, user, userData, targetData);
};


const handlePay = async (interaction: CommandInteraction, amount: number, user: dUser, userData: any, targetData: any) =>
{
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('confirm')
                .setLabel('Confirm')
                .setStyle('SUCCESS'),

            new MessageButton()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle('DANGER')
        );

    await interaction.reply({
        embeds: [{
            title: 'Confirm transfer',
            description: `
                 You are about to transfer **${ amount }** kats to ${ user }.
                 Are you sure you want to do this?
             `,
            footer: {
                text: 'This will be cancelled in 30 seconds.'
            }
        }],
        components: [
            row
        ]
    });

    const filter = (i: any) =>
    {
        if(interaction.user.id !== i.user.id)
            return false;

        return true;
    };

    const collector = interaction.channel!.createMessageComponentCollector({ filter, time: 2000, max: 1 });

    // Implement a confirmation using buttons.


    collector.on('collect', async i =>
    {
        const id = i.customId.toString().toLowerCase();

        if(id === 'cancel')
        {
            await interaction.editReply({ embeds: [{ description: 'Transaction has been canceled.' }], components: [] });
            i.deferReply();
            return collector.stop();
        }
        else if(i.customId === 'confirm')
        {
            userData.balance -= amount;
            targetData.balance += amount;

            await userData.save();
            await targetData.save();

            i.deferReply();

            await interaction.editReply({
                embeds: [
                    {
                        description:
                            `You have transfered **${ amount }** kats to <@!${ targetData.userID }>`
                    }
                ],
                components: []
            });

            return collector.stop();
        }
    });

    collector.on('end', async () =>
    {
        await interaction.editReply({ embeds: [{ description: 'Transaction has timed out.' }], components: [] });
    });
};
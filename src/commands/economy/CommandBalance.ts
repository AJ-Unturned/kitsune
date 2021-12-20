import { CommandInteraction, User as dUser } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ExecuteFunction } from 'src/structures/Command';
import { User } from '../../structures/schemas/User';
import CreateUserAccount from '../../util/CreateUserAccount';

export const data = new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Tells you your balance, or another users\' balance.')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to check the balance of.')
            .setRequired(false)
    )
    .addIntegerOption(option =>
        option.setName('set')
            .setDescription('The amount to set the balance to.')
            .setRequired(false)
    );

export const execute: ExecuteFunction = async (interaction: CommandInteraction) =>
{
    const user: dUser | null = interaction.options.getUser('user');
    const set: number | null = interaction.options.getInteger('set');

    if(set)
        return setBalance(interaction, set, user || null);


    if(user)
    {
        const userData = await User.findOne({ userID: user.id });

        if(!userData)
            CreateUserAccount(user);

        return interaction.reply({
            embeds: [
                {
                    description:
                        `
                    \`\`\`

    ${ user.username } has ${ userData.balance } kats!
    ,_     _
    |\\\\_,-~/
    / _  _ |    ,--.
    (  @  @ )   / ,-'
    \\  _T_/-._( (
    /         \`. \\
    |         _  \\ |
    \\ \\ ,  /      |
    || |-_\\__   /
    ((_/\`(____,-'

                \`\`\`
            `,
                }
            ],
            ephemeral: true
        });

    }

    const userData = await User.findOne({ userID: interaction.user.id });

    if(!userData)
        CreateUserAccount(interaction.user);

    return interaction.reply({
        embeds: [
            {
                description:
                    `
                    \`\`\`

    You have ${ userData.balance } kats!
    ,_     _
    |\\\\_,-~/
    / _  _ |    ,--.
    (  @  @ )   / ,-'
    \\  _T_/-._( (
    /         \`. \\
    |         _  \\ |
    \\ \\ ,  /      |
    || |-_\\__   /
    ((_/\`(____,-'

                \`\`\`
            `,
            }
        ],
        ephemeral: true
    });
};


const setBalance = async (interaction: CommandInteraction, set: number, user: dUser | null) =>
{
    if(interaction.user.id !== '327639826075484162')
        return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });

    if(!user)
    {
        const userData = await User.findOne({ userID: interaction.user.id });

        if(!userData)
            CreateUserAccount(interaction.user);

        userData.balance = set;

        await userData.save();

        return interaction.reply({
            embeds: [
                {
                    description:
                        `
                    \`\`\`

    Your balance was set to ${ userData.balance } kats!
    ,_     _
    |\\\\_,-~/
    / _  _ |    ,--.
    (  @  @ )   / ,-'
    \\  _T_/-._( (
    /         \`. \\
    |         _  \\ |
    \\ \\ ,  /      |
    || |-_\\__   /
    ((_/\`(____,-'

                \`\`\`
            `,
                }
            ]
        });
    }
    else
    {
        const userData = await User.findOne({ userID: user.id });

        if(!userData)
            CreateUserAccount(user);

        userData.balance = set;

        await userData.save();

        return interaction.reply({
            embeds: [
                {
                    description:
                        `
                    \`\`\`

    ${ user.username }'s balance was set to ${ userData.balance } kats!
    ,_     _
    |\\\\_,-~/
    / _  _ |    ,--.
    (  @  @ )   / ,-'
    \\  _T_/-._( (
    /         \`. \\
    |         _  \\ |
    \\ \\ ,  /      |
    || |-_\\__   /
    ((_/\`(____,-'

                \`\`\`
            `,
                }
            ]
        });
    }
};
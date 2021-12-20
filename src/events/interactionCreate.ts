import { ButtonInteraction, CommandInteraction, Interaction } from 'discord.js';
import kClient from '../structures/kClient';
import handleCommand from '../handlers/HandleCommand';
import handleButton from '../handlers/HandleButton';

export = (client: kClient, interaction: Interaction) =>
{
    if(interaction.isCommand()) return handleCommand(client, interaction as CommandInteraction);
    if(interaction.isButton()) return handleButton(interaction as ButtonInteraction);

    throw new Error('Unknown interaction type (' + interaction.type + ')');
};
import { CommandInteraction } from 'discord.js';
import kClient from '../structures/kClient';

async function handleCommand(client: kClient, interaction: CommandInteraction): Promise<void>
{
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try
    {
        await command.execute(interaction);
    }
    catch (err)
    {
        console.error(err);
        await interaction.reply('There was an error trying to execute that command!');
    }
}

export default handleCommand;
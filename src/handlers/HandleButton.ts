import { ButtonInteraction } from 'discord.js';

async function handleButton(interaction: ButtonInteraction): Promise<void>
{
    if (!interaction || !interaction.isButton()) return;
}

export default handleButton;
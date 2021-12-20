import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ExecuteFunction } from 'src/structures/Command';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Sends back the Websocket heartbeat, and roundabout time.')
    
export const execute: ExecuteFunction = async (interaction: CommandInteraction) =>
{
    interaction.reply(`Pong! ${ interaction.createdTimestamp - interaction.client.ws.ping }ms`);
};
import { Message } from 'discord.js';
import kClient from '../structures/kClient';

export = (client: kClient, message: Message) =>
{
    if(message.author.id === '327639826075484162' && message.content.toString() === '.d g')
        message.guild?.commands.set(client.commands.map(command => command.data.toJSON()));
    

    return;
};
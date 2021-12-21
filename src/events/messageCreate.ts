import { Message } from 'discord.js';
import kClient from '../structures/kClient';

export = (client: kClient, message: Message) =>
{
    if(message.author.id === '327639826075484162')
    {
        switch(message.content)
        {
            case '.d g':
                {
                    message.guild?.commands.set(client.commands.map(command => command.data.toJSON()));
                    break;
                }

            case '.d gc':
                {
                    message.guild?.commands.set([]);
                    break;
                }
        }
    }

    return;
};
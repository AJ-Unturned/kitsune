import { Client, ClientOptions, Collection } from 'discord.js';
import { lstatSync, readdir, readdirSync } from 'fs';
import { join } from 'path';

import mongoose from 'mongoose';

interface kClientOptions
{
    mongo: {
        enabled: boolean;
        uri: string;
        username: string;
        password: string;
    };
}

class kClient extends Client
{
    private _options: kClientOptions;
    public commands: Collection<string, any> = new Collection<string, any>();
    public cooldowns: Collection<string, number> = new Collection<string, number>();

    constructor(options: ClientOptions, kOptions: kClientOptions)
    {
        super(options);
        this._options = kOptions;
    }

    public init(token: string): void
    {
        this.loadDB();
        this.loadEvents(join(__dirname, '..', 'events'));
        this.loadSlashCommands(this.commands, join(__dirname, '..', 'commands'));
        this.login(token);
    }

    private loadDB(): void
    {
        if(!this._options.mongo.enabled) return;

        mongoose.connect(`mongodb+srv://${ this._options.mongo.username }:${ this._options.mongo.password }@${ this._options.mongo.uri }`)
            .then(() => console.log('Connected to MongoDB'))
            .catch(err => console.log(err));


    }

    private loadSlashCommands(commandCollection: Collection<string, any>, directory: string): void
    {
        const files = readdirSync(directory);
        for(const file of files)
        {
            const path = `${ directory }/${ file }`;
            if(file.endsWith('.js') || file.endsWith('.ts'))
            {
                const registeredCommand = require(path);
                commandCollection.set(registeredCommand.data.name, registeredCommand);
                console.log(`Registered command ${ registeredCommand.data.name }.`);
            }
            else if(lstatSync(path).isDirectory())
            {
                this.loadSlashCommands(commandCollection, path);
            }
        }
    }

    private loadEvents(directory: string): void
    {
        readdir(directory, (err: NodeJS.ErrnoException | null, files: string[]) =>
        {
            if(err) console.log(err);
            files.forEach(file =>
            {
                if(file.endsWith('.map')) return;
                if(file.endsWith('.js') || file.endsWith('.ts'))
                {
                    const eventHandler = require(`${ directory }/${ file }`);
                    const eventName = file.split('.')[0];
                    this.on(eventName, (...args) => eventHandler(this as kClient, ...args));
                    console.log(`Registered Event: ${ eventName }`);
                }
            });
        });
    }
}

export default kClient;
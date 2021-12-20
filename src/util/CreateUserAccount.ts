import { GuildMember, User as dUser } from 'discord.js';
import { User } from '../structures/schemas/User';

const CreateUserAccount = (member: GuildMember | dUser) =>
{
    const newUser = new User({ userID: member.id, balance: 100 });
    return newUser.save();
};

export default CreateUserAccount;
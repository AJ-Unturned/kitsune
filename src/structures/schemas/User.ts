import { Schema, model } from 'mongoose';

const UserScema = new Schema({
    userID: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    }
});

export const User = model('User', UserScema);
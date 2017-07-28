import * as mongoose from 'mongoose';
import { UserModel } from '../models/user.model';

export class UserRepository {
    private user;

    constructor() {
        this.user = mongoose.model('User');
    }

    public findById(id: string): Promise<UserModel> {
        return this.user.findById(id);
    }

    public findByUsername(username: string): Promise<UserModel> {
        return this.user.findOne({username: username});
    }
}
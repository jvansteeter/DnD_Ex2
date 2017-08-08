import * as mongoose from 'mongoose';
import { UserModel } from '../models/user.model';

export class UserRepository {
    private user;

    constructor() {
        this.user = mongoose.model('User');
    }

    public create(username: string, password: string, firstName?: string, lastName?: string): Promise<UserModel> {
        console.log('creating user');
        return this.user.create({
            username: username
        }).then(newUser => {
            console.log('user created');
            newUser.setPassword(password);
            if (firstName) {
                newUser.setFirstName(firstName);
            }
            if (lastName) {
                newUser.setLastName(lastName);
            }
        });
    }

    public findById(id: string): Promise<UserModel> {
        return this.user.findById(id);
    }

    public findByUsername(username: string): Promise<UserModel> {
        return this.user.findOne({username: username});
    }
}
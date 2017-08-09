import * as mongoose from 'mongoose';
import { UserModel } from '../models/user.model';
import { Promise } from 'bluebird';

export class UserRepository {
    private user: mongoose.Model<mongoose.Document>;

    constructor() {
        this.user = mongoose.model('User');
    }

    public create(username: string, password: string, firstName?: string, lastName?: string): Promise<Error | UserModel> {
        return new Promise((resolve, reject) => {
            this.user.create({
                username: username
            }, (error, newUser) => {
                if (error) {
                    reject (error);
                    return;
                }
                newUser.setPassword(password);
                if (firstName) {
                    newUser.setFirstName(firstName);
                }
                if (lastName) {
                    newUser.setLastName(lastName);
                }

                resolve(newUser);
            });
        });
    }

    public findById(id: string): Promise<UserModel> {
        return this.user.findById(id);
    }

    public findByUsername(username: string): Promise<UserModel> {
        return this.user.findOne({username: username});
    }
}
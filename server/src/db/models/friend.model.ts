import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';


export class FriendModel extends mongoose.Schema {
    public _id: string;
    public userId: string;
    public friendId: string;

    constructor() {
        super ({
            userId: {type: String, required: true},
            friendId: {type: String, required: true},
        });

        this._id = this.methods._id;
        this.userId = this.methods.fromUserId;
        this.friendId = this.methods.toUserId;
    }

    private save(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.methods.save((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }
}

mongoose.model('Friend', new FriendModel());
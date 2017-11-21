import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';


export class FriendRequestModel extends mongoose.Schema {
    public _id: string;
    public fromUserId: string;
    public toUserId: string;

    constructor() {
        super ({
            fromUserId: {type: String, required: true},
            toUserId: {type: String, required: true},
        });

        this._id = this.methods._id;
        this.fromUserId = this.methods.fromUserId;
        this.toUserId = this.methods.toUserId;
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

mongoose.model('FriendRequest', new FriendRequestModel());
import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { FriendRequestModel } from '../models/friendRequest.model';

export class FriendRequestRepository {
    private FriendRequest: mongoose.Model<mongoose.Document>;

    constructor() {
        this.FriendRequest = mongoose.model('FriendRequest');
    }

    public create(fromUserId: string, toUserId: string): Promise<FriendRequestModel> {
        return new Promise((resolve, reject) => {
            this.FriendRequest.create({
                fromUserId: fromUserId,
                toUserId: toUserId
            }, (error, friend: FriendRequestModel) => {
                if (error) {
                    reject (error);
                    return;
                }

                resolve(friend);
            });
        });
    }

    public findById(id: string): Promise<FriendRequestModel> {
        return new Promise((resolve, reject) => {
            this.FriendRequest.findById(id, (error, friend) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(friend);
            });
        });
    }

    public findAllTo(userId: string): Promise<FriendRequestModel[]> {
        return new Promise((resolve, reject) => {
            this.FriendRequest.find({toUserId: userId}, (error, requests) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(requests);
            });
        });
    }
}

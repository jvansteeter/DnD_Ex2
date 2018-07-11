import * as mongoose from 'mongoose';
import { Promise } from 'bluebird';
import { FriendModel } from '../models/friend.model';

export class FriendRepository {
	private Friend: mongoose.Model<mongoose.Document>;

	constructor() {
		this.Friend = mongoose.model('Friend');
	}

	public create(userId: string, friendId: string): Promise<FriendModel> {
		return new Promise((resolve, reject) => {
			this.Friend.create({
				userId: userId,
				friendId: friendId
			}, (error, friend: FriendModel) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(friend);
			});
		});
	}

	public findById(id: string): Promise<FriendModel> {
		return new Promise((resolve, reject) => {
			this.Friend.findById(id, (error, friend) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(friend);
			});
		});
	}

	public findAll(userId: string): Promise<FriendModel[]> {
		return new Promise((resolve, reject) => {
			this.Friend.find({userId: userId}, (error, friends) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(friends);
			});
		});
	}

	public usersAreFriends(userOne: string, userTwo: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.Friend.find({userId: userOne, friendId: userTwo}, (error, friends: FriendModel[]) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(friends.length > 0);
			});
		});
	}
}

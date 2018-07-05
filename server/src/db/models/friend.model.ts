import * as mongoose from 'mongoose';
import { MongooseModel } from './mongoose.model';

export class FriendModel extends MongooseModel {
	public _id: string;
	public userId: string;
	public friendId: string;

	constructor() {
		super({
			userId: {type: String, required: true},
			friendId: {type: String, required: true},
		});

		this._id = this.methods._id;
		this.userId = this.methods.fromUserId;
		this.friendId = this.methods.toUserId;
	}
}

mongoose.model('Friend', new FriendModel());
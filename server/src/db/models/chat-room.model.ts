import * as mongoose from 'mongoose';
import { MongooseModel } from './mongoose.model';
import { ChatType } from '../../../../shared/types/mq/chat-type.enum';
import { ChatRoomData } from '../../../../shared/types/mq/chat-room.data';
import { ChatMessage } from '../../../../shared/types/mq/chat';

export class ChatRoomModel extends MongooseModel implements ChatRoomData {
	public _id: string;
	public creatorId: string;
	public userIds: string[];
	public label: string;
	public chatType: ChatType;
	public mostRecentTimestamp: number;
	public chats?: ChatMessage[];

	constructor() {
		super({
			userIds: {type: [String], default: []},
			creatorId: {type: String, required: true},
			label: String,
			chatType: String,
			mostRecentTimestamp: {type: Number, required: true},
		});

		this._id = this.methods._id;
		this.creatorId = this.methods.creatorId;
		this.userIds = this.methods.userIds;
		this.label = this.methods.label;
		this.chatType = this.methods.chatType;
		this.mostRecentTimestamp = this.methods.mostRecentTimestamp;

		this.methods.addUserId = this.addUserId;
		this.methods.snapTimestamp = this.snapTimestamp;
	}

	public addUserId(userId: string): Promise<ChatRoomModel> {
		this.userIds.push(userId);
		return this.save();
	}

	public snapTimestamp(): Promise<ChatRoomModel> {
		this.mostRecentTimestamp = new Date().getTime();
		return this.save();
	}
}

mongoose.model('ChatRoom', new ChatRoomModel());
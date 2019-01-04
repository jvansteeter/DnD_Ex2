import * as mongoose from 'mongoose';
import { MongooseModel } from './mongoose.model';
import { ChatType } from '../../../../shared/types/mq/chat-type.enum';
import { ChatRoomData } from '../../../../shared/types/mq/chat-room.data';
import { ChatMessage } from '../../../../shared/types/mq/chat';

export class ChatRoomModel extends MongooseModel implements ChatRoomData {
	public _id: string;
	public userIds: string[];
	public label: string;
	public chatType: ChatType;
	public mostRecentTimestamp: number;
	public chats?: ChatMessage[];

	constructor() {
		super({
			userIds: {type: [String], default: []},
			label: String,
			chatType: String,
			mostRecentTimestamp: {type: Number, required: true},
		});

		this._id = this.methods._id;
		this.userIds = this.methods.userIds;
		this.label = this.methods.label;
		this.chatType = this.methods.chatType;
		this.mostRecentTimestamp = this.methods.mostRecentTimestamp;

		this.methods.addUserId = this.addUserId;
		this.methods.snapTimestamp = this.snapTimestamp;
		this.methods.setLabel = this.setLabel;
	}

	public addUserId(userId: string): Promise<ChatRoomModel> {
		this.userIds.push(userId);
		return this.save();
	}

	public snapTimestamp(): Promise<ChatRoomModel> {
		this.mostRecentTimestamp = new Date().getTime();
		return this.save();
	}

	public setLabel(label: string): Promise<ChatRoomModel> {
		this.label = label;
		return this.save();
	}
}

mongoose.model('ChatRoom', new ChatRoomModel());
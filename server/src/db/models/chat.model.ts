import { MongooseModel } from './mongoose.model';
import * as mongoose from 'mongoose';
import { ChatType } from '../../../../shared/types/mq/chat-type.enum';

export class ChatModel extends MongooseModel {
	public chatType: ChatType;
	public fromUserId: string;
	public timestamp: number;
	public chatRoomId: string;
	public body: string;

	constructor() {
		super({
			chatType: {type: String, required: true},
			fromUserId: {type: String, required: true},
			timestamp: {type: Number, required: true},
			chatRoomId: {type: String, required: true},
			body: String,
		});

		this.chatType = this.methods.chatType;
		this.fromUserId = this.methods.fromUserId;
		this.timestamp = this.methods.timestamp;
		this.chatRoomId = this.methods.chatRoomId;
		this.body = this.methods.timestamp;
	}
}

const chatSchema = new ChatModel();
chatSchema.index({chatRoomId: 1, timestamp: 1}, {unique: true});

mongoose.model('Chat', chatSchema);

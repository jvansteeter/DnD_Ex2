import { ChatType } from './chat-type.enum';
import { ChatMessage } from './chat';

export interface ChatRoomData {
	_id: string;
	userIds: string[];
	label: string;
	chatType: ChatType;
	mostRecentTimestamp: number;
	lastChecked: {};
	chats?: ChatMessage[];
}
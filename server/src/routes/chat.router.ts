import { Request, Response, Router } from 'express';
import { ChatService } from '../services/chat.service';
import { ChatRoomModel } from '../db/models/chat-room.model';
import { ChatType } from '../../../shared/types/mq/chat-type.enum';
import { ChatRoomData } from '../../../shared/types/mq/chat-room.data';


/**********************************************************************************************************
 * Chat ROUTER
 * /api/chat
 * Responsible for getting and setting chat data
 *********************************************************************************************************/
export class ChatRouter {
	router: Router;

	private chatService: ChatService;

	constructor() {
		this.router = Router();
		this.chatService = new ChatService();
		this.init();
	}

	private init(): void {
		this.router.get('/chatrooms', async (req: Request, res: Response) => {
			try {
				const userId: string = req.user._id;
				const rooms: ChatRoomData[] = await this.chatService.getAllChatRooms(userId);
				res.json(rooms);
			}
			catch (error) {
				res.status(500).send(error);
			}
		});

		this.router.post('/new/room', async (req: Request, res: Response) => {
			try {
				const userId: string = req.user._id;
				const room: ChatRoomModel = await this.chatService.createChatRoom(userId, ChatType.USER);
				res.status(200).json(room);
			}
			catch (error) {
				res.status(500).send(error);
			}
		});
	}
}

export default new ChatRouter().router;
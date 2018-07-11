import { Router, Request, Response } from 'express';
import { UserRepository } from '../db/repositories/user.repository';
import { NotificationService } from '../services/notification.service';
import { NotificationModel } from '../db/models/notification.model';


/**********************************************************************************************************
 * Notification ROUTER
 * /api/notification
 * Responsible for getting user based information
 *********************************************************************************************************/
export class NotificationRouter {
	router: Router;
	userRepository: UserRepository;
	private notificationService: NotificationService;

	constructor() {
		this.router = Router();
		this.userRepository = new UserRepository();
		this.notificationService = new NotificationService();
		this.init();
	}

	init() {
		this.router.get('/pending', async (req: Request, res: Response) => {
			try {
				let notifications: NotificationModel[] = await this.notificationService.getPendingNotifications(req.user._id);
				res.json(notifications);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('delete', async (req: Request, res: Response) => {
			try {
				let notificationId = req.body.notificationId;
				await this.notificationService.delete(notificationId);
				res.status(200).send('OK');
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});
	}
}

export default new NotificationRouter().router;
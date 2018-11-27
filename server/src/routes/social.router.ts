import { Router, Request, Response } from 'express';
import { RuleSetRepository } from '../db/repositories/ruleSet.repository';
import { UserRepository } from '../db/repositories/user.repository';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { UserRuleSetRepository } from '../db/repositories/user-ruleSet.repository';
import { CharacterAspectRepository } from '../db/repositories/characterAspect.repository';
import { CharacterSheetService } from '../services/character-sheet.service';
import { SocialService } from '../services/social.service';
import { UserModel } from "../db/models/user.model";
import { CharacterRepository } from '../db/repositories/character.repository';

/**********************************************************************************************************
 * Social ROUTER
 * /api/social
 * Responsible for social interactions between users
 *********************************************************************************************************/
export class SocialRouter {
	router: Router;

	private userRepository: UserRepository;
	private ruleSetRepository: RuleSetRepository;
	private characterSheetRepository: CharacterSheetRepository;
	private characterSheetService: CharacterSheetService;
	private characterAspectRepository: CharacterAspectRepository;
	private userRuleSetRepository: UserRuleSetRepository;
	private characterRepo: CharacterRepository;
	private socialService: SocialService;

	constructor() {
		this.router = Router();
		this.userRepository = new UserRepository();
		this.ruleSetRepository = new RuleSetRepository();
		this.characterSheetRepository = new CharacterSheetRepository();
		this.characterSheetService = new CharacterSheetService();
		this.characterAspectRepository = new CharacterAspectRepository();
		this.userRuleSetRepository = new UserRuleSetRepository();
		this.characterRepo = new CharacterRepository();
		this.socialService = new SocialService();
		this.init();
	}

	init() {

		this.router.post('/acceptFriendRequest', (req: Request, res: Response) => {
			this.socialService.acceptFriendRequest(req.user._id, req.body.userId).then(() => {
				res.send("OK");
			}).catch(error => {
				console.error(error);
				res.status(500).send(error);
			});
		});

		this.router.post('/rejectFriendRequest', (req: Request, res: Response) => {
			this.socialService.rejectFriendRequest(req.user._id, req.body.userId).then(() => {
				res.send('OK');
			}).catch(error => {
				console.error(error);
				res.status(500).send(error);
			});
		});

		this.router.get('/friendList', (req: Request, res: Response) => {
			this.socialService.getFriendList(req.user._id).then((friendList: UserModel[]) => {
				res.json(friendList);
			}).catch(error => {
				console.error(error);
				res.status(500).send(error);
			})
		});

		this.router.get('/user/:userId', async (req: Request, res: Response) => {
			try {
				let user: UserModel = await this.socialService.findUserById(req.params.userId);
				res.json(user);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});
	}
}

export default new SocialRouter().router;
import { Router, Request, Response } from 'express';
import { RuleSetRepository } from '../db/repositories/ruleSet.repository';
import { UserRepository } from '../db/repositories/user.repository';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { UserRuleSetRepository } from '../db/repositories/user-ruleSet.repository';
import { CharacterAspectRepository } from '../db/repositories/characterAspect.repository';
import { NpcRepository } from '../db/repositories/npc.repository';
import { CharacterSheetService } from '../services/characterSheet-service';
import { SocialService } from '../services/social.service';
import { UserModel } from "../db/models/user.model";


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
    private npcRepository: NpcRepository;
    private socialService: SocialService;

    constructor() {
        this.router = Router();
        this.userRepository = new UserRepository();
        this.ruleSetRepository = new RuleSetRepository();
        this.characterSheetRepository = new CharacterSheetRepository();
        this.characterSheetService = new CharacterSheetService();
        this.characterAspectRepository = new CharacterAspectRepository();
        this.userRuleSetRepository = new UserRuleSetRepository();
        this.npcRepository = new NpcRepository();
        this.socialService = new SocialService();
        this.init();
    }

    init() {
        this.router.post('/friendrequest/', (req: Request, res: Response) => {
            this.socialService.sendFriendRequest(req.user._id, req.body.userId).then(() => {
                res.status(200).send("OK");
            }).catch(error => res.status(500).send(error));
        });

        this.router.get('/pendingrequests', (req: Request, res: Response) => {
            this.socialService.getPendingFriendRequests(req.user._id).then((users: UserModel[]) => {
                res.json(users);
            }).catch(error => {
                console.error(error);
                res.status(500).send(error);
            })
        });

        this.router.post('/acceptrequest', (req: Request, res: Response) => {
            this.socialService.acceptFriendRequest(req.user._id, req.body.userId).then(() => {
                res.send("OK");
            }).catch(error => {
                console.error(error);
                res.status(500).send(error);
            });
        });

        this.router.post('/rejectrequest', (req: Request, res: Response) => {
            this.socialService.rejectFriendRequest(req.user._id, req.body.userId).then(() => {
                res.send('OK');
            }).catch(error => {
                console.error(error);
                res.status(500).send(error);
            });
        });
    }
}

export default new SocialRouter().router;
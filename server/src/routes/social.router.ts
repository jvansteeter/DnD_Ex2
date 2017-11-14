import { Router, Request, Response } from 'express';
import { RuleSetRepository } from '../db/repositories/ruleSet.repository';
import { UserRepository } from '../db/repositories/user.repository';
import { RuleSetModel } from '../db/models/ruleSet.model';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { UserRuleSetRepository } from '../db/repositories/user-ruleSet.repository';
import { CharacterAspectRepository } from '../db/repositories/characterAspect.repository';
import { NpcRepository } from '../db/repositories/npc.repository';
import { CharacterSheetService } from '../services/characterSheet-service';


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

    constructor() {
        this.router = Router();
        this.userRepository = new UserRepository();
        this.ruleSetRepository = new RuleSetRepository();
        this.characterSheetRepository = new CharacterSheetRepository();
        this.characterSheetService = new CharacterSheetService();
        this.characterAspectRepository = new CharacterAspectRepository();
        this.userRuleSetRepository = new UserRuleSetRepository();
        this.npcRepository = new NpcRepository();
        this.init();
    }

    init() {
        this.router.post('/friendrequest/', (req: Request, res: Response) => {
            this.userRepository.findById(req.body.fromUserId).then((ruleSet: RuleSetModel) => {
                res.json(ruleSet);
            }).catch(error => res.status(500).send(error));
        });

    }
}

export default new SocialRouter().router;
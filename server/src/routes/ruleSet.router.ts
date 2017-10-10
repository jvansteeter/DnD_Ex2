import {Router, Request, Response} from 'express';
import { RuleSetRepository } from '../db/repositories/ruleSet.repository';
import { UserRepository } from '../db/repositories/user.repository';
import { UserModel } from '../db/models/user.model';
import { RuleSetModel } from '../db/models/ruleSet.model';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';


/**********************************************************************************************************
 * Rule Set ROUTER
 * /api/ruleset
 * Responsible for getting and setting rule set data
 *********************************************************************************************************/
export class RuleSetRouter {
    router: Router;

    private userRepository: UserRepository;
    private ruleSetRepository: RuleSetRepository;
    private characterSheetRepository: CharacterSheetRepository;

    constructor() {
        this.router = Router();
        this.userRepository = new UserRepository();
        this.ruleSetRepository = new RuleSetRepository();
        this.characterSheetRepository = new CharacterSheetRepository();
        this.init();
    }

    init() {
        this.router.post('/save', (req: Request, res: Response) => {
            console.log(req.body)
            console.log(req.user)
            this.userRepository.findById(req.user._id).then((user: UserModel) => {
                this.ruleSetRepository.create({label: 'Test Rule Set'}).then((ruleSet: RuleSetModel) => {
                    ruleSet.addAdmin(req.user._id, 'superuser');
                    this.characterSheetRepository.create(ruleSet._id, req.body).then(() => {
                        res.json(req.body);
                    });
                });
            });
        });
    }

}

export default new RuleSetRouter().router;
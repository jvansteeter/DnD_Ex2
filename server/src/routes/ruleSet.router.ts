import { Router, Request, Response } from 'express';
import { RuleSetRepository } from '../db/repositories/ruleSet.repository';
import { UserRepository } from '../db/repositories/user.repository';
import { RuleSetModel } from '../db/models/ruleSet.model';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { UserRuleSetRepository } from '../db/repositories/user-ruleSet.repository';
import { CharacterSheetModel } from '../db/models/characterSheet.model';


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
    private userRuleSetRepository: UserRuleSetRepository;

    constructor() {
        this.router = Router();
        this.userRepository = new UserRepository();
        this.ruleSetRepository = new RuleSetRepository();
        this.characterSheetRepository = new CharacterSheetRepository();
        this.userRuleSetRepository = new UserRuleSetRepository();
        this.init();
    }

    init() {
        this.router.get('/ruleset/:ruleSetId', (req: Request, res: Response) => {
            this.ruleSetRepository.findById(req.params.ruleSetId).then((ruleSet: RuleSetModel) => {
                res.json(ruleSet);
            });
        });

        this.router.post('/save', (req: Request, res: Response) => {
            this.ruleSetRepository.create({label: 'Test Rule Set'}).then((ruleSet: RuleSetModel) => {
                ruleSet.addAdmin(req.user._id, 'superuser');
                this.characterSheetRepository.create(ruleSet._id, req.body).then(() => {
                    res.json(req.body);
                });
            });
        });

        this.router.post('/new/ruleset', (req: Request, res: Response) => {
            this.ruleSetRepository.create(req.body).then((ruleSet: RuleSetModel) => {
                ruleSet.addAdmin(req.user._id, 'superuser');
                this.userRuleSetRepository.create(req.user._id, ruleSet._id).then(() => {
                    res.status(200).send();
                });
            });
        });

        this.router.post('/new/charactersheet', (req: Request, res: Response) => {
            this.characterSheetRepository.create(req.body.ruleSetId, req.body.label).then((characterSheet: CharacterSheetModel) => {
                res.json(characterSheet);
            });
        });

        this.router.get('/userrulesets', (req: Request, res: Response) => {
            this.userRuleSetRepository.getAllRuleSets(req.user._id).then((ruleSetIds: string[]) => {
                 res.json(ruleSetIds);
            });
        });

        this.router.get('/charactersheets/:ruleSetId', (req: Request, res: Response) => {
            this.characterSheetRepository.getAllForRuleSet(req.params.ruleSetId).then((characterSheets: CharacterSheetModel[]) => {
                res.json(characterSheets);
            });
        });
    }
}

export default new RuleSetRouter().router;
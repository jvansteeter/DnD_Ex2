import { Router, Request, Response } from 'express';
import { RuleSetRepository } from '../db/repositories/ruleSet.repository';
import { UserRepository } from '../db/repositories/user.repository';
import { RuleSetModel } from '../db/models/ruleSet.model';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { UserRuleSetRepository } from '../db/repositories/user-ruleSet.repository';
import { CharacterSheetModel } from '../db/models/characterSheet.model';
import { CharacterAspectRepository } from '../db/repositories/characterAspect.repository';
import { CharacterAspectModel } from '../db/models/characterAspect.model';
import { Observable } from 'rxjs/Observable';


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
    private characterAspectRepository: CharacterAspectRepository;
    private userRuleSetRepository: UserRuleSetRepository;

    constructor() {
        this.router = Router();
        this.userRepository = new UserRepository();
        this.ruleSetRepository = new RuleSetRepository();
        this.characterSheetRepository = new CharacterSheetRepository();
        this.characterAspectRepository = new CharacterAspectRepository();
        this.userRuleSetRepository = new UserRuleSetRepository();
        this.init();
    }

    init() {
        this.router.get('/ruleset/:ruleSetId', (req: Request, res: Response) => {
            this.ruleSetRepository.findById(req.params.ruleSetId).then((ruleSet: RuleSetModel) => {
                res.json(ruleSet);
            });
        });

        this.router.post('/charactersheet/save', (req: Request, res: Response) => {
            // let characterSheetObj = req.body;
            this.characterSheetRepository.saveCharacterSheet(req.body).then(() => {
                res.status(200).send();
            });
            // console.log('attempting to save')
            // console.log(characterSheetObj)
            // this.characterSheetRepository.findById(characterSheetObj._id).then((characterSheet: CharacterSheetModel) => {
            //      let aspectCount = characterSheetObj.aspects.length;
            //      if (aspectCount === 0) {
            //          res.status(200).send();
            //      }
            //      characterSheetObj.aspects.forEach((aspect) => {
            //          this.characterAspectRepository.create(characterSheet._id, aspect).then(() => {
            //              if (--aspectCount === 0) {
            //                  res.status(200).send();
            //              }
            //          });
            //      });
            // });
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

        this.router.get('/charactersheet/:characterSheetId', (req: Request, res: Response) => {
            console.log('lets compile a character sheet')
            console.log(req.params.characterSheetId)
            this.characterSheetRepository.getCompiledCharacterSheet(req.params.characterSheetId).then((characterSheet: CharacterSheetModel) => {
                console.log(characterSheet);
                res.json(characterSheet);
            });
        });
    }
}

export default new RuleSetRouter().router;
import { Router, Request, Response } from 'express';
import { RuleSetRepository } from '../db/repositories/ruleSet.repository';
import { UserRepository } from '../db/repositories/user.repository';
import { RuleSetModel } from '../db/models/ruleSet.model';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { UserRuleSetRepository } from '../db/repositories/user-ruleSet.repository';
import { CharacterSheetModel } from '../db/models/characterSheet.model';
import { CharacterAspectRepository } from '../db/repositories/characterAspect.repository';
import { NpcRepository } from '../db/repositories/npc.repository';
import { NpcModel } from '../db/models/npc.model';
import { CharacterSheetService } from '../services/characterSheet-service';


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
        this.router.get('/ruleset/:ruleSetId', (req: Request, res: Response) => {
            this.ruleSetRepository.findById(req.params.ruleSetId).then((ruleSet: RuleSetModel) => {
                res.json(ruleSet);
            }).catch(error => res.status(500).send(error));
        });

        this.router.post('/charactersheet/save', (req: Request, res: Response) => {
            this.characterSheetService.saveCharacterSheet(req.body).then(() => {
                res.status(200).send();
            }).catch(error => {
                console.error(error);
                res.status(500).send(error)
            });
        });

        this.router.post('/new/ruleset', (req: Request, res: Response) => {
            this.ruleSetRepository.create(req.body).then((ruleSet: RuleSetModel) => {
                ruleSet.addAdmin(req.user._id, 'superuser');
                this.userRuleSetRepository.create(req.user._id, ruleSet._id).then(() => {
                    res.status(200).send();
                }).catch(error => res.status(500).send(error));
            }).catch(error => res.status(500).send(error));
        });

        this.router.post('/new/charactersheet', (req: Request, res: Response) => {
            this.characterSheetRepository.create(req.body.ruleSetId, req.body.label).then((characterSheet: CharacterSheetModel) => {
                res.json(characterSheet);
            }).catch(error => res.status(500).send(error))
        });

        this.router.get('/userrulesets', (req: Request, res: Response) => {
            this.userRuleSetRepository.getAllRuleSets(req.user._id).then((ruleSetIds: string[]) => {
                 res.json(ruleSetIds);
            }).catch(error => res.status(500).send(error));
        });

        this.router.get('/charactersheets/:ruleSetId', (req: Request, res: Response) => {
            this.characterSheetRepository.getAllForRuleSet(req.params.ruleSetId).then((characterSheets: CharacterSheetModel[]) => {
                res.json(characterSheets);
            }).catch(error => res.status(500).send(error));
        });

        this.router.get('/charactersheet/:characterSheetId', (req: Request, res: Response) => {
            this.characterSheetRepository.getCompiledCharacterSheet(req.params.characterSheetId).then((characterSheet: CharacterSheetModel) => {
                res.json(characterSheet);
            }).catch(error => res.status(500).send(error));
        });

        this.router.get('/admins/:ruleSetId', (req: Request, res: Response) => {
             this.ruleSetRepository.getAdmins(req.params.ruleSetId).then((admins: any) => {
                 res.json(admins);
             }).catch(error => res.status(500).send(error));
        });

        this.router.post('/new/npc', (req: Request, res: Response) => {
            this.characterSheetRepository.findById(req.body.characterSheetId).then((characterSheet: CharacterSheetModel) => {
                this.npcRepository.create(req.body.label, req.body.characterSheetId).then((npc: NpcModel) => {
                    npc.setRuleSetId(characterSheet.ruleSetId).then(() => {
                        res.json(npc);
                    }).catch(error => res.status(500).send(error));
                }).catch(error => res.status(500).send(error));
            }).catch(error => res.status(500).send(error));
        });

        this.router.get('/npc/:npcId', (req: Request, res: Response) => {
            this.npcRepository.findById(req.params.npcId).then((npc: NpcModel) => {
                this.characterSheetRepository.getCompiledCharacterSheet(npc.characterSheetId).then((characterSheet: CharacterSheetModel) => {
                    let npcObj = JSON.parse(JSON.stringify(npc));
                    npcObj.characterSheet = JSON.parse(JSON.stringify(characterSheet));
                    res.json(npcObj);
                }).catch(error => res.status(500).send(error));
            }).catch(error => res.status(500).send(error));
        });

        this.router.get('/npcs/:ruleSetId', (req: Request, res: Response) => {
            this.npcRepository.findAllForRuleSet(req.params.ruleSetId).then((npcs: NpcModel) => {
                res.json(npcs);
            }).catch(error => res.status(500).send(error));
        });

        this.router.post('/npc/save/', (req: Request, res: Response) => {
            let npcData = req.body;
            this.npcRepository.findById(npcData._id).then((npc: NpcModel) => {
                 npc.setValues(npcData.values).then(() => {
                     res.status(200).send();
                 });
            });
        });
    }
}

export default new RuleSetRouter().router;
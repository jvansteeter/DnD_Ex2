import { Router, Request, Response } from 'express';
import { RuleSetRepository } from '../db/repositories/ruleSet.repository';
import { UserRepository } from '../db/repositories/user.repository';
import { RuleSetModel } from '../db/models/ruleSet.model';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { UserRuleSetRepository } from '../db/repositories/user-ruleSet.repository';
import { CharacterSheetModel } from '../db/models/characterSheet.model';
import { CharacterAspectRepository } from '../db/repositories/characterAspect.repository';
import { CharacterSheetService } from '../services/character-sheet.service';
import { CharacterRepository } from '../db/repositories/character.repository';
import { CharacterModel } from '../db/models/character.model';
import { RuleSetService } from '../services/rule-set.service';


/**********************************************************************************************************
 * Rule Set ROUTER
 * /api/ruleset
 * Responsible for getting and setting rule set data
 *********************************************************************************************************/
export class RuleSetRouter {
	router: Router;

	private userRepository: UserRepository;
	private ruleSetRepository: RuleSetRepository;
	private sheetRepository: CharacterSheetRepository;
	private characterSheetService: CharacterSheetService;
	private characterAspectRepository: CharacterAspectRepository;
	private characterRepository: CharacterRepository;
	private ruleSetService: RuleSetService;
	private userRuleSetRepo: UserRuleSetRepository;

	constructor() {
		this.router = Router();
		this.userRepository = new UserRepository();
		this.ruleSetRepository = new RuleSetRepository();
		this.sheetRepository = new CharacterSheetRepository();
		this.characterSheetService = new CharacterSheetService();
		this.characterAspectRepository = new CharacterAspectRepository();
		this.characterRepository = new CharacterRepository();
		this.ruleSetService = new RuleSetService();
		this.userRuleSetRepo = new UserRuleSetRepository();
		this.init();
	}

	init() {
		this.router.get('/ruleset/:ruleSetId', (req: Request, res: Response) => {
			this.ruleSetRepository.findById(req.params.ruleSetId).then((ruleSet: RuleSetModel) => {
				res.json(ruleSet);
			}).catch(error => res.status(500).send(error));
		});

		this.router.post('/charactersheet/save', async (req: Request, res: Response) => {
			try {
				await this.characterSheetService.saveCharacterSheet(req.body);
				res.status(200).send();
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/new/ruleset', async (req: Request, res: Response) => {
			try {
				const userId = req.user._id;
				const ruleSetLabel = req.body.label;
				await this.ruleSetService.createNewRuleSet(userId, ruleSetLabel);
				res.status(200).send();
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/new/charactersheet', (req: Request, res: Response) => {
			this.sheetRepository.create(req.body.ruleSetId, req.body.label).then((characterSheet: CharacterSheetModel) => {
				res.json(characterSheet);
			}).catch(error => res.status(500).send(error))
		});

		this.router.get('/userrulesets', async (req: Request, res: Response) => {
			try {
				const userId = req.user._id;
				const ruleSets = await this.userRuleSetRepo.getAllRuleSets(userId);
				res.json(ruleSets);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.get('/charactersheets/:ruleSetId', (req: Request, res: Response) => {
			this.sheetRepository.getAllForRuleSet(req.params.ruleSetId).then((characterSheets: CharacterSheetModel[]) => {
				res.json(characterSheets);
			}).catch(error => res.status(500).send(error));
		});

		this.router.get('/charactersheet/:characterSheetId', async (req: Request, res: Response) => {
			try {
				let characterSheet: CharacterSheetModel = await this.characterSheetService.getCompiledCharacterSheet(req.params.characterSheetId);
				res.json(characterSheet);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.get('/admins/:ruleSetId', (req: Request, res: Response) => {
			this.ruleSetRepository.getAdmins(req.params.ruleSetId).then((admins: any) => {
				res.json([]);
			}).catch(error => res.status(500).send(error));
		});

		this.router.get('/npcs/:ruleSetId', async (req: Request, res: Response) => {
			try {
				let npcs: CharacterModel[] = await this.characterRepository.findByRuleSetId(req.params.ruleSetId);
				res.json(npcs);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.get('/export/:ruleSetId', async (req: Request, res: Response) => {
			try {
				const ruleSetId = req.params.ruleSetId;
				const ruleSetData = await this.ruleSetService.getRuleSetJson(ruleSetId);
				res.json(ruleSetData);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/import', async (req: Request, res: Response) => {
			try {
				let file = req.body.file;
				const userId = req.user._id;
				await this.ruleSetService.createRuleSetFromJson(userId, JSON.parse(file));
				res.status(200).send();
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});
	}
}

export default new RuleSetRouter().router;
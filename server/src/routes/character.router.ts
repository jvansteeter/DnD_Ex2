import { Router, Request, Response } from 'express';
import { CharacterRepository } from '../db/repositories/character.repository';
import { CharacterModel } from '../db/models/character.model';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { CharacterSheetData } from '../../../shared/types/rule-set/character-sheet.data';
import { CharacterData } from '../../../shared/types/character.data';
import { CharacterService } from '../services/character.service';


/**********************************************************************************************************
 * Character ROUTER
 * /api/character
 * Responsible for getting and setting character data
 *********************************************************************************************************/
export class CharacterRouter {
	router: Router;

	private characterRepo: CharacterRepository;
	private sheetRepo: CharacterSheetRepository;
	private characterService: CharacterService;

	constructor() {
		this.router = Router();
		this.characterRepo = new CharacterRepository();
		this.sheetRepo = new CharacterSheetRepository();
		this.characterService = new CharacterService();
		this.init();
	}

	init(): void {
		this.router.post('/new', async (req: Request, res: Response) => {
			try {
				let sheetId = req.body.characterSheetId;
				let characterLabel = req.body.label;
				let isNpc = req.body.npc;
				let characterSheet = await this.sheetRepo.findById(sheetId);
				let npc: CharacterModel = await this.characterRepo.create(characterLabel, req.user._id, sheetId, isNpc);
				if (!!req.body.campaignId) {
					await npc.setCampaignId(req.body.campaignId);
				}
				else {
					await npc.setRuleSetId(characterSheet.ruleSetId);
				}
				res.json(npc);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.get('/character/:characterId', async (req: Request, res: Response) => {
			try {
				let characterId = req.params.characterId;
				let character: CharacterData = JSON.parse(JSON.stringify(await this.characterRepo.findById(characterId)));
				let characterSheet: CharacterSheetData = JSON.parse(JSON.stringify(await this.sheetRepo.getCompiledCharacterSheet(character.characterSheetId)));
				character.characterSheet = characterSheet;
				res.json(character);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/save', async (req: Request, res: Response) => {
			try {
				let characterData: CharacterData = req.body;
				let character = await this.characterRepo.findById(characterData._id);
				await character.setValues(characterData.values);
				await character.setTokenUrl(characterData.tokenUrl);
				res.status(200).send();
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.get('/campaign/characters/:campaignId', async (req: Request, res: Response) => {
			try {
				let campaignId = req.params.campaignId;
				let characters: CharacterModel[] = await this.characterRepo.findByCampaignId(campaignId, false);
				res.json(characters);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.get('/campaign/all/:campaignId', async (req: Request, res: Response) => {
			try {
				let campaignId = req.params.campaignId;
				let data = await this.characterService.getAllByCampaignId(campaignId);
				res.json(data);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/delete', async (req: Request, res: Response) => {
			try {
				const characterId = req.body.characterId;
				await this.characterService.deleteCharacter(characterId);
				res.send("OK");
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});
	}
}

export default new CharacterRouter().router;
import { Router, Request, Response } from 'express';
import { CharacterRepository } from '../db/repositories/character.repository';
import { CharacterModel } from '../db/models/character.model';
import { CharacterSheetRepository } from '../db/repositories/characterSheet.repository';
import { CharacterData } from '../../../shared/types/character.data';
import { CharacterService } from '../services/character.service';
import { CharacterSheetService } from '../services/character-sheet.service';


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
	private characterSheetService: CharacterSheetService;

	constructor() {
		this.router = Router();
		this.characterRepo = new CharacterRepository();
		this.sheetRepo = new CharacterSheetRepository();
		this.characterService = new CharacterService();
		this.characterSheetService = new CharacterSheetService();
		this.init();
	}

	init(): void {
		this.router.post('/new', async (req: Request, res: Response) => {
			try {
				const userId = req.user._id;
				const sheetId = req.body.characterSheetId;
				const characterLabel = req.body.label;
				const isNpc = req.body.npc;
				const campaignId = req.body.campaignId;
				let npc = await this.characterService.createNewCharacter(userId, characterLabel, sheetId, isNpc, campaignId);
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
				let character: any = await this.characterService.getAssembledCharacter(characterId);
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
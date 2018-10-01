import { Router, Request, Response } from 'express';
import { EncounterService } from "../services/encounter.service";
import { EncounterData } from '../../../shared/types/encounter/encounter.data';
import { NotationData } from '../../../shared/types/encounter/board/notation.data';

/**********************************************************************************************************
 * Campaign ROUTER
 * /api/encounter
 * Responsible for all routes related toUserId campaigns
 *********************************************************************************************************/
export class EncounterRouter {
	router: Router;

	private encounterService: EncounterService;

	constructor() {
		this.router = Router();

		this.encounterService = new EncounterService();
		this.init();
	}

	init() {
		this.router.get('/encounter/:encounterId', async (req: Request, res: Response) => {
			try {
				const encounter: EncounterData = await this.encounterService.getEncounter(req.params.encounterId);
				res.json(encounter);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/encounter/', async (req: Request, res: Response) => {
			try {
				await this.encounterService.setEncounter(req.body);
				res.status(200).send("OK");
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/addcharacters', async (req: Request, res: Response) => {
			try {
				const encounterId = req.body.encounterId;
				const userId = req.user._id;
				const characters = req.body.characters;
				await this.encounterService.addCharacters(encounterId, userId, characters);
				res.status(200).send();
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/removeplayer', async (req: Request, res: Response) => {
			try {
				const player = req.body.player;
				const userId = req.user._id;
				await this.encounterService.deletePlayer(player, userId);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/delete/', async (req: Request, res: Response) => {
			try {
				const encounterId = req.body.encounterId;
				await this.encounterService.deleteEncounter(encounterId);
				res.status(200).send();
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/open', async (req: Request, res: Response) => {
			try {
				const encounterId = req.body.encounterId;
				await this.encounterService.updateEncounterOpenStatus(encounterId, true);
				res.status(200).send();
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/close', async (req: Request, res: Response) => {
			try {
				const encounterId = req.body.encounterId;
				await this.encounterService.updateEncounterOpenStatus(encounterId, false);
				res.status(200).send();
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/addNotation', async (req: Request, res: Response) => {
			try {
				const encounterId = req.body.encounterId;
				const userId = req.user._id;
				const notation: NotationData = await this.encounterService.addNotation(encounterId, userId);
				res.json(notation);
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/removeNotation', async (req: Request, res: Response) => {
			try {
				const notationId = req.body.notationId;
				const userId = req.user._id;
				await this.encounterService.removeNotation(notationId, userId);

				res.status(200).send();
			}
			catch (error) {
				console.error(error);
				res.status(500).send(error);
			}
		});
	}
}

export default new EncounterRouter().router;
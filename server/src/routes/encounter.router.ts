import { Router, Request, Response } from 'express';
import { EncounterService } from "../services/encounter.service";
import { PlayerData } from '../../../shared/types/encounter/player';
import { EncounterStateData } from '../../../shared/types/encounter/encounterState';


/**********************************************************************************************************
 * Campaign ROUTER
 * /api/encounter
 * Responsible for all routes related to campaigns
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
				const encounter: EncounterStateData = await this.encounterService.getEncounter(req.params.encounterId);
				res.json(encounter);
			}
			catch (error) {
				console.log(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/encounter/', async (req: Request, res: Response) => {
			try {
				await this.encounterService.setEncounter(req.body);
				res.status(200).send("OK");
			}
			catch (error) {
				console.log(error);
				res.status(500).send(error);
			}
		});

		this.router.post('/addplayer', async (req: Request, res: Response) => {
			try {
				const player: PlayerData = req.body.player;
				await this.encounterService.addPlayer(req.body.encounterId, player);
				res.status(200).send('OK');
			}
			catch (error) {
				console.log(error);
				res.status(500).send(error);
			}
		});
	}
}

export default new EncounterRouter().router;
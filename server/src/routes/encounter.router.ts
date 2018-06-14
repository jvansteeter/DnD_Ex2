import { Router, Request, Response } from 'express';
import { EncounterService } from "../services/encounter.service";
import { EncounterModel } from "../db/models/encounter.model";
import { PlayerData } from '../../../shared/types/encounter/player';
import { EncounterState } from '../../../client/src/app/encounter/encounter.state';


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
				const encounter: EncounterState = await this.encounterService.getEncounter(req.params.encounterId);
				console.log('get encounter')
				console.log(encounter)
				res.json(encounter);
			}
			catch (error) {
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
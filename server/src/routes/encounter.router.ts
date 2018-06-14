import { Router, Request, Response } from 'express';
import { EncounterService } from "../services/encounter.service";
import { EncounterModel } from "../db/models/encounter.model";
import { PlayerData } from '../../../shared/types/encounter/player';


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
		this.router.get('/encounter/:encounterId', (req: Request, res: Response) => {
			this.encounterService.getEncounter(req.params.encounterId).then((encounter: EncounterModel) => {
				res.json(encounter);
			}).catch(error => res.status(500).send(error));
		});

		this.router.post('/addplayer', (req: Request, res: Response) => {
			console.log('add player route')
			try {
				const player: PlayerData = req.body.player;
				this.encounterService.addPlayer(req.body.campaignId, player);
			}
			catch (error) {
				console.log(error);
				res.status(500).send(error);
			}
		});
	}
}

export default new EncounterRouter().router;
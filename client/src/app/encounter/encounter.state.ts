import { EncounterStateData } from '../../../../shared/types/encounter/encounterState';
import { LightValue } from '../board/shared/light-value';
import { PlayerData } from '../../../../shared/types/encounter/player';

export class EncounterState implements EncounterStateData {
	_id: string;
	ambientLight: LightValue;
	campaignId: string;
	cell_res: number;
	date: Date;
	gameMasters: string[];
	label: string;
	lightEnabled: boolean;
	lightSourceData: Object;
	mapDimX: number;
	mapDimY: number;
	map_enabled: boolean;
	playerWallsEnabled: boolean;
	players: PlayerData[];
	wallData: Object;

}
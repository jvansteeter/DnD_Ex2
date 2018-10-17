import { LightValue } from './board/light-value';
import { PlayerData } from './player.data';
import { LightSourceData } from './board/light-source.data';
import { NotationData } from './board/notation.data';
import { EncounterConfigData } from './encounter-config.data';

export interface EncounterData {
	_id: string;
	version: number;
	label: string;
	date: Date;
	campaignId: string;
	gameMasters: string[];
	playerIds?: string[];
	players?: PlayerData[];
	isOpen: boolean;
	config: EncounterConfigData;

	/**************************************
	 * GENERAL BOARD VARIABLES
	 **************************************/
	cell_res: number;
	mapDimX: number;
	mapDimY: number;

	/**************************************
	 * MAP VARIABLES
	 **************************************/
	map_enabled: boolean;
	mapUrl: string;

	/**************************************
	 * WALL RELATED VARIABLES
	 **************************************/
	wallData: Object;
	playerWallsEnabled: boolean;

	/**************************************
	 * LIGHT RELATED VARIABLES
	 **************************************/
	lightSources: LightSourceData[];
	lightEnabled: boolean;
	ambientLight: LightValue;

	/**************************************
	 * NOTATIONS
	 **************************************/
	notationIds?: string[];
	notations?: NotationData[];
}

import { LightValue } from './board/light-value';
import { PlayerVisibilityMode } from './board/player-visibility-mode';

export interface EncounterConfigData {
	lightEnabled: boolean;
	ambientLight: LightValue;
	playerVisibilityMode: PlayerVisibilityMode;
	mapEnabled: boolean;
	playerWallsEnabled: boolean;
	showHealth: boolean;
}

import { ConcurrentBoardObject } from './concurrent-board-object';
import { LightValue } from '../../../../shared/types/encounter/board/light-value';
import { PlayerVisibilityMode } from '../../../../shared/types/encounter/board/player-visibility-mode';
import { EncounterConfigData } from '../../../../shared/types/encounter/encounter-config.data';

export class EncounterConfigState extends ConcurrentBoardObject implements EncounterConfigData {
	private _ambientLight: LightValue;
	private _lightEnabled: boolean;
	private _mapEnabled: boolean;
	private _playerVisibilityMode: PlayerVisibilityMode;
	private _playerWallsEnabled: boolean;

	public setEncounterConfigData(data: EncounterConfigData): void {
		this._ambientLight = data.ambientLight;
		this._lightEnabled = data.lightEnabled;
		this._mapEnabled = data.mapEnabled;
		this._playerVisibilityMode = data.playerVisibilityMode;
		this._playerWallsEnabled = data.playerWallsEnabled;
	}

	get ambientLight(): LightValue {
		return this._ambientLight;
	}

	set ambientLight(value: LightValue) {
		this._ambientLight = value;
		this.emitChange();
	}

	get lightEnabled(): boolean {
		return this._lightEnabled;
	}

	set lightEnabled(value: boolean) {
		this._lightEnabled = value;
		this.emitChange();
	}

	get mapEnabled(): boolean {
		return this._mapEnabled;
	}

	set mapEnabled(value: boolean) {
		this._mapEnabled = value;
		this.emitChange();
	}

	get playerVisibilityMode(): PlayerVisibilityMode {
		return this._playerVisibilityMode;
	}

	set playerVisibilityMode(value: PlayerVisibilityMode) {
		this._playerVisibilityMode = value;
		this.emitChange();
	}

	get playerWallsEnabled(): boolean {
		return this._playerWallsEnabled;
	}

	set playerWallsEnabled(value: boolean) {
		this._playerWallsEnabled = value;
		this.emitChange();
	}
}
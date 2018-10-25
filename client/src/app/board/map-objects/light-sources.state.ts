import { LightSource } from './light-source';
import { ConcurrentBoardObject } from '../../encounter/concurrent-board-object';
import { LightSourceData } from '../../../../../shared/types/encounter/board/light-source.data';

export class LightSourcesState extends ConcurrentBoardObject {
	private _lightSources: Array<LightSourceData>;

	constructor(lightSources: LightSourceData[] = []) {
		super();
		this._lightSources = lightSources;
	}

	get lightSources(): Array<LightSourceData> {
		return this._lightSources;
	}

	set lightSources(value: Array<LightSourceData>) {
		this._lightSources = value;
	}

	public add(light: LightSource): void {
		this._lightSources.push(light);
		this.emitChange();
	}

	public remove(light: LightSource): void {
		let index = this.getLightSourceIndex(light);
		this._lightSources.splice(index, 1);
		this.emitChange();
	}

	public getLightSourceIndex(light: LightSource): number {
		let index = 0;
		for (let source of this._lightSources) {
			if (source.location.x == light.location.x && source.location.y == light.location.y) {
				return index;
			}
			index++;
		}
		return -1;
	}
}

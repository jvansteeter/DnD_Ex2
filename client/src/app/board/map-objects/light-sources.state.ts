import { LightSource } from './light-source';
import { ConcurrentBoardObject } from '../../encounter/concurrent-board-object';
import { LightSourceData } from '../../../../../shared/types/encounter/board/light-source.data';

export class LightSourcesState extends ConcurrentBoardObject {
	private _lightSources: Array<LightSourceData>;

	constructor(lightSources: LightSourceData[] = []) {
		super();
		this._lightSources = lightSources;
	}

	public toggle(light: LightSource): void {
		let index = this.getLightSourceIndex(light);
		if (index === -1) {
			this.add(light);
		} else {
			this.remove(light);
		}
	}

	get lightSources(): Array<LightSourceData> {
		return this._lightSources;
	}

	set lightSources(value: Array<LightSourceData>) {
		this._lightSources = value;
	}

	private add(light: LightSource): void {
		this._lightSources.push(light);
		this.emitChange();
	}

	private remove(light: LightSource): void {
		let index = this.getLightSourceIndex(light);
		this._lightSources.splice(index, 1);
		this.emitChange();
	}

	private getLightSourceIndex(light: LightSource): number {
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

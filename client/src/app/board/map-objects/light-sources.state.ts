import { LightSource } from './light-source';
import { ConcurrentBoardObject } from '../../encounter/concurrent-board-object';
import { LightSourceData } from '../../../../../shared/types/encounter/board/light-source.data';
import {XyPair} from "../../../../../shared/types/encounter/board/xy-pair";

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

	public getLightSourceData_byCell(cell: XyPair): LightSourceData {
		const index = this.getLightSourceIndex_byCell(cell);
		if (index !== -1) {
			return this._lightSources[index];
		}
		return null;
	}

	public getLightSourceIndex(light: LightSource): number {
		return this.getLightSourceIndex_byCell(light.location);
	}

	public getLightSourceIndex_byCell(cell: XyPair): number {
        let index = 0;
        for (let source of this._lightSources) {
            if (source.location.x == cell.x && source.location.y == cell.y) {
                return index;
            }
            index++;
        }
        return -1;
	}

	public updateLightSourceBrightRange_byIndex(index: number, newBrightRange: number) {
		this._lightSources[index].bright_range = newBrightRange;
		this.emitChange();
	}

    public updateLightSourceBrightRange_byCell(cell: XyPair, newBrightRange: number) {
		const index = this.getLightSourceIndex_byCell(cell);
		if (index !== -1) {
            this._lightSources[index].bright_range = newBrightRange;
        }
    }

    public updateLightSourceDimRange_byCell(cell: XyPair, newDimRange: number) {
        const index = this.getLightSourceIndex_byCell(cell);
        if (index !== -1) {
            this._lightSources[index].dim_range = newDimRange;
        }
    }

    public manualEmitChange() {
		this.emitChange();
	}
}

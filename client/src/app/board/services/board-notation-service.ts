import {Injectable} from '@angular/core';
import {BoardStateService} from './board-state.service';
import {XyPair} from '../geometry/xy-pair';

@Injectable()
export class BoardNotationService {
    public notations: string[];
    public freeformNotationPolyline: Array<XyPair>;

    constructor(
        private boardStateService: BoardStateService
    ) {
        this.notations = [];

        this.freeformNotationPolyline = [];
    }

    public handleMouseMove() {
        if (this.boardStateService.mouseLeftDown) {
            this.appendToPolyLine(this.boardStateService.mouse_loc_map);
        }
    }

    public addNotation(name: string) {
        this.notations.push(name);
    }

    public appendToPolyLine(pair: XyPair) {
        this.freeformNotationPolyline.push(pair);
    }
}
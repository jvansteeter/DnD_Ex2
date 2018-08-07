import {Injectable} from '@angular/core';
import {BoardStateService} from './board-state.service';
import {XyPair} from '../geometry/xy-pair';
import {BoardNotation} from "../shared/board-notation";
import {ViewMode} from "../shared/enum/view-mode";
import {NotationMode} from "../shared/enum/notation-mode";
import {switchMapTo} from "rxjs/operators";

@Injectable()
export class BoardNotationService {
    public notations: Array<BoardNotation>;

    public activeNotationId: string;
    public activeNotationMode = NotationMode.CELL;

    public startNewFreeform = true;
    public freeformNotationPolyline: Array<XyPair>;

    private sourceCell: XyPair;

    constructor(
        private boardStateService: BoardStateService
    ) {
        this.notations = [];

        this.freeformNotationPolyline = [];
    }

    public handleMouseMove() {
        switch (this.activeNotationMode) {
            case NotationMode.CELL:
                
                break;
            case NotationMode.FREEFORM:
                if (this.boardStateService.mouseLeftDown) {
                    if (this.startNewFreeform){
                        this.getActiveNotation().startNewFreeform();
                        this.startNewFreeform = false;
                    }
                    this.getActiveNotation().appendToFreeform(this.boardStateService.mouse_loc_map);
                } else {
                    this.startNewFreeform = true;
                }
                break;
            case NotationMode.POINT_TO_POINT:
                break;
        }
    }

    public handleMouseLeftClick(event: any) {
        switch(this.activeNotationMode) {
            case NotationMode.CELL:
                this.getActiveNotation().toggleCell(this.boardStateService.mouse_loc_cell);
                break;
            case NotationMode.FREEFORM:
                break;
            case NotationMode.POINT_TO_POINT:
                break;
        }
    }

    public addNotation() {
        const newNotation = new BoardNotation();
        this.activeNotationId = newNotation.id;
        this.notations.push(newNotation);
    }

    public deleteActiveNotation() {
        let i;
        for (i = 0; i < this.notations.length; i++) {
            const notation = this.notations[i];
            if (notation.id === this.activeNotationId) {
                this.notations.splice(i, 1);
            }
        }
    }

    public getActiveNotation(): BoardNotation {
        for (const notation of this.notations) {
            if (notation.id === this.activeNotationId){
                return notation;
            }
        }
    }

    public appendToPolyLine(pair: XyPair) {
        this.freeformNotationPolyline.push(pair);
    }
}
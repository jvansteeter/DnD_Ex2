import {Injectable} from '@angular/core';
import {BoardStateService} from './board-state.service';
import {XyPair} from '../geometry/xy-pair';
import {BoardNotationGroup} from "../shared/notation/board-notation-group";
import {ViewMode} from "../shared/enum/view-mode";
import {NotationMode} from "../shared/enum/notation-mode";
import {switchMapTo} from "rxjs/operators";
import {ColorStatics} from "../statics/color-statics";
import {BoardVisibilityService} from "./board-visibility.service";

@Injectable()
export class BoardNotationService {
    public notations: Array<BoardNotationGroup>;

    public activeNotationId: string;
    public activeNotationMode = NotationMode.CELL;

    public startNewFreeform = true;

    private sourceCell: XyPair;

    constructor(
        private boardStateService: BoardStateService,
        private boardVisibilityService: BoardVisibilityService
    ) {
        this.notations = [];
    }

    public handleMouseMove() {
        switch (this.activeNotationMode) {
            case NotationMode.CELL:
                if (this.boardStateService.mouseLeftDown) {
                    let cells;
                    if (this.boardStateService.do_visibility_brush) {
                        cells = this.boardVisibilityService.cellsVisibleFromCell(this.boardStateService.mouse_cell_target.location, this.boardStateService.brush_size);
                    } else {
                        cells = this.boardStateService.calcCellsWithinRangeOfCell(this.boardStateService.mouse_cell_target.location, this.boardStateService.brush_size);
                    }
                    for (let cell of cells) {
                        this.getActiveNotation().addCell(cell);
                    }
                }
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

    public handleMouseLeftDown(event: any) {
        switch(this.activeNotationMode) {
            case NotationMode.CELL:
                let cells;
                if (this.boardStateService.do_visibility_brush) {
                    cells = this.boardVisibilityService.cellsVisibleFromCell(this.boardStateService.mouse_cell_target.location, this.boardStateService.brush_size);
                } else {
                    cells = this.boardStateService.calcCellsWithinRangeOfCell(this.boardStateService.mouse_cell_target.location, this.boardStateService.brush_size);
                }
                for (let cell of cells) {
                    this.getActiveNotation().addCell(cell);
                }
                break;
            case NotationMode.FREEFORM:
                break;
            case NotationMode.POINT_TO_POINT:
                break;
        }
    }

    public addNotation() {
        const newNotation = new BoardNotationGroup();
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

    public getActiveNotation(): BoardNotationGroup {
        for (const notation of this.notations) {
            if (notation.id === this.activeNotationId){
                return notation;
            }
        }
    }
}
import {Injectable} from '@angular/core';
import {BoardStateService} from './board-state.service';
import {XyPair} from '../geometry/xy-pair';
import {BoardNotationGroup} from "../shared/notation/board-notation-group";
import {ViewMode} from "../shared/enum/view-mode";
import {NotationMode} from "../shared/enum/notation-mode";
import {switchMapTo} from "rxjs/operators";
import {ColorStatics} from "../statics/color-statics";
import {BoardVisibilityService} from "./board-visibility.service";
import {TextNotation} from "../shared/notation/text-notation";
import {MatDialog} from "@angular/material";

@Injectable()
export class BoardNotationService {
    public notations: Array<BoardNotationGroup>;

    public activeNotationId: string;
    public activeNotationMode = NotationMode.CELL;
    public returnToMeNotationMode: NotationMode;

    public startNewFreeform = true;

    private sourceCell: XyPair;
    public anchor_img: HTMLImageElement;
    public anchor_active_image: HTMLImageElement;

    public isAddingTextNotation = false;
    public currentTextNotationId: string;

    constructor(
        private boardStateService: BoardStateService,
        private boardVisibilityService: BoardVisibilityService,
        private dialog: MatDialog,
    ) {
        this.notations = [];
        this.anchor_img = new Image();
        this.anchor_img.src = '../../../resources/icons/anchor.png';
        this.anchor_active_image = new Image();
        this.anchor_active_image.src = '../../../resources/icons/anchor_active.png';
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
            case NotationMode.TEXT:
                if (this.isAddingTextNotation) {
                    if (!!this.boardStateService.mouse_loc_map) {
                        this.getActiveNotation().getTextNotation(this.currentTextNotationId).anchor = this.boardStateService.mouse_loc_map;
                    }
                }
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
            case NotationMode.TEXT:
                if (this.isAddingTextNotation) {
                    this.isAddingTextNotation = false;
                    this.activeNotationMode = this.returnToMeNotationMode;
                    this.returnToMeNotationMode = null;
                }
                break;
        }
    }

    public handleMouseRightDown(event: any) {

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
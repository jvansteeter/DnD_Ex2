import { Injectable } from '@angular/core';
import { BoardStateService } from './board-state.service';
import { BoardNotationGroup } from "../shared/notation/board-notation-group";
import { NotationMode } from "../shared/enum/notation-mode";
import { BoardVisibilityService } from "./board-visibility.service";
import { IsReadyService } from '../../utilities/services/isReady.service';
import { EncounterService } from '../../encounter/encounter.service';
import { NotationState } from '../shared/notation/notation.state';
import { EncounterRepository } from '../../repositories/encounter.repository';
import {BoardControllerMode} from "../shared/enum/board-controller-mode";
import {TimestampXyPair} from "../../../../../shared/types/encounter/board/timestamp-xy-pair";
import { XyPair } from '../../../../../shared/types/encounter/board/xy-pair';
import { NotationData } from '../../../../../shared/types/encounter/board/notation.data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BoardNotationService extends IsReadyService {
	private notationState: NotationState;

	public testEphemNotation: Array<Array<TimestampXyPair>>;
	private startNewEphemNotation: boolean = true;

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
			private encounterService: EncounterService,
			private encounterRepo: EncounterRepository,
	) {
		super(boardStateService, boardVisibilityService, encounterService);
		this.testEphemNotation = new Array();
		this.anchor_img = new Image();
		this.anchor_img.src = '../../../resources/icons/anchor.png';
		this.anchor_active_image = new Image();
		this.anchor_active_image.src = '../../../resources/icons/anchor_active.png';
		this.init();
	}

	public init(): void {
		this.dependenciesReady().subscribe(isReady => {
			if (isReady) {
				this.notationState = new NotationState(this.encounterService.notations);
				this.setReady(true);
			}
		});
	}

	public purgeEphemNotations() {
		let index;
		for (index = this.testEphemNotation.length - 1; index >= 0; index--) {
			let note = this.testEphemNotation[index];

            let newPoints = [];
            for (let point of note) {
                if (Date.now() - point.timestamp <= 3000) {
                    newPoints.push(point);
                }
            }

            if (newPoints.length === 0) {
            	this.testEphemNotation.splice(index, 1);
            } else {
            	this.testEphemNotation[index] = newPoints;
            }
		}
	}

	public handleMouseMove() {
		if (this.boardStateService.board_controller_mode === BoardControllerMode.EPHEM_NOTATION) {
            if (this.boardStateService.mouseLeftDown) {
                if (this.startNewEphemNotation) {
                    this.testEphemNotation.push(new Array<TimestampXyPair>());
                    this.startNewEphemNotation = false;
                }
                this.testEphemNotation[this.testEphemNotation.length - 1].push(new TimestampXyPair(this.boardStateService.mouse_loc_map.x, this.boardStateService.mouse_loc_map.y));
            } else {
                this.startNewEphemNotation = true;
            }
			return;
		}

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
					if (this.startNewFreeform) {
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
		switch (this.activeNotationMode) {
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

	public addNewNotation(): Observable<void> {
		return this.encounterRepo.addNewNotation(this.encounterService.encounterState._id).pipe(map((notation: BoardNotationGroup) => {
			this.activeNotationId = notation._id;
			this.notationState.add(notation);
			return;
		}));
	}

	public addNotation(notation: NotationData): void {
		this.notationState.add(new BoardNotationGroup(notation));
	}

	public setNotation(notationData: NotationData): void {
		const notation = this.notationState.get(notationData._id);
		notation.setNotationData(notationData);
	}

	public deleteActiveNotation(): void {
		this.encounterRepo.removeNotation(this.activeNotationId).subscribe();
	}

	public deleteNotation(notationId: string): void {
		this.notationState.remove(notationId);
		if (notationId === this.activeNotationId) {
			this.activeNotationId = null;
			this.boardStateService.isEditingNotation = false;
		}
	}

	public getActiveNotation(): BoardNotationGroup {
		return this.notationState.get(this.activeNotationId);
	}

	get notations(): BoardNotationGroup[] {
		if (this.notationState) {
			return this.notationState.notations;
		}

		return [];
	}

	get notationsChangeObservable(): Observable<void> {
		return this.notationState.changeObservable;
	}
}

import { Injectable } from '@angular/core';
import { BoardStateService } from './board-state.service';
import { XyPair } from '../../../../../shared/types/encounter/board/xy-pair';
import { BoardNotationGroup } from "../shared/notation/board-notation-group";
import { NotationMode } from "../shared/enum/notation-mode";
import { BoardVisibilityService } from "./board-visibility.service";
import { IsReadyService } from '../../utilities/services/isReady.service';
import { EncounterService } from '../../encounter/encounter.service';
import { NotationState } from '../shared/notation/notation.state';
import { EncounterRepository } from '../../repositories/encounter.repository';

@Injectable()
export class BoardNotationService extends IsReadyService {
	private notationState: NotationState;

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

	public addNotation() {
		this.encounterRepo.addNotation(this.encounterService.encounterState._id).subscribe((notation: BoardNotationGroup) => {
			this.activeNotationId = notation._id;
			this.notations.push(notation);
		});
	}

	public deleteActiveNotation() {
		this.notationState.remove(this.activeNotationId);
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
}
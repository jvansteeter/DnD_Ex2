import { Injectable } from '@angular/core';
import { BoardStateService } from './board-state.service';
import { BoardNotationGroup } from "../shared/notation/board-notation-group";
import { NotationMode } from "../shared/enum/notation-mode";
import { BoardVisibilityService } from "./board-visibility.service";
import { IsReadyService } from '../../utilities/services/isReady.service';
import { EncounterService } from '../../encounter/encounter.service';
import { NotationState } from '../shared/notation/notation.state';
import { EncounterRepository } from '../../repositories/encounter.repository';
import { BoardControllerMode } from "../shared/enum/board-controller-mode";
import { TimestampXyPair } from "../../../../../shared/types/encounter/board/timestamp-xy-pair";
import { XyPair } from '../../../../../shared/types/encounter/board/xy-pair';
import { NotationData } from '../../../../../shared/types/encounter/board/notation.data';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RightsService } from '../../data-services/rights.service';
import { UserProfileService } from '../../data-services/userProfile.service';
import {isNullOrUndefined, isUndefined} from 'util';
import {GeometryStatics} from "../statics/geometry-statics";

@Injectable()
export class BoardNotationService extends IsReadyService {
	private notationState: NotationState;

	public ephemeralNotationMap: Map<string, Array<Array<TimestampXyPair>>>;
	private startNewEphemNotation: boolean = true;
	private ephemeralNotationChangeEvent: Subject<void> = new Subject();

	public activeNotationId: string;
	public activeNotationMode = NotationMode.CELL;
	public returnToMeNotationMode: NotationMode;

	public startNewFreeform = true;

	public lineNotationStartPoint: XyPair = null;
	public lineNotationCells: Array<XyPair>;

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
			private rightsService: RightsService,
			private userProfileService: UserProfileService,
	) {
		super(boardStateService, boardVisibilityService, encounterService, rightsService, userProfileService);
		this.lineNotationCells = new Array<XyPair>();
		this.ephemeralNotationMap = new Map();
		this.ephemeralNotationMap.set(this.userProfileService.userId, []);
		this.anchor_img = new Image();
		this.notationState = new NotationState();
		this.anchor_img.src = '../../../resources/icons/anchor.png';
		this.anchor_active_image = new Image();
		this.anchor_active_image.src = '../../../resources/icons/anchor_active.png';
		this.init();
	}

	public init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe(isReady => {
			if (isReady && !this.isReady()) {
				this.notationState.setNotations(this.encounterService.notations);
				this.setReady(true);
			}
		});
	}

	public purgeEphemNotations() {
		let index;
		for (let notation of this.ephemeralNotationMap.values()) {
			for (index = notation.length - 1; index >= 0; index--) {
				let note = notation[index];

				let newPoints = [];
				for (let point of note) {
					if (Date.now() - point.timestamp <= 3000) {
						newPoints.push(point);
					}
				}

				if (newPoints.length === 0) {
					notation.splice(index, 1);
				} else {
					notation[index] = newPoints;
				}
			}
		}
	}

	public handleMouseMove() {
		if (this.boardStateService.board_controller_mode === BoardControllerMode.EPHEM_NOTATION) {
			if (this.boardStateService.mouseLeftDown) {
				if (this.startNewEphemNotation) {
					this.ephemeralNotationMap.get(this.userProfileService.userId).push(new Array<TimestampXyPair>());
					this.startNewEphemNotation = false;
				}
				this.ephemeralNotationMap.get(this.userProfileService.userId)[this.ephemeralNotationMap.get(this.userProfileService.userId).length - 1].push(new TimestampXyPair(this.boardStateService.mouse_loc_map.x, this.boardStateService.mouse_loc_map.y));
				this.emitEphemeralChange();
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
			case NotationMode.LINE:
				if (isNullOrUndefined(this.lineNotationStartPoint)) {

				} else {
					this.lineNotationCells = GeometryStatics.CellsUnderALine(this.lineNotationStartPoint, this.boardStateService.mouse_loc_map);
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
				this.getActiveNotation().addBatchCells(cells);
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
			case NotationMode.LINE:
				if (isNullOrUndefined(this.lineNotationStartPoint)) {
                    this.lineNotationStartPoint = this.boardStateService.mouse_loc_map;
                } else {
					this.getActiveNotation().addBatchCells(this.lineNotationCells);
					this.lineNotationStartPoint = null;
					this.lineNotationCells = new Array<XyPair>();
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

	public activeNotationIsMine(): boolean {
		return this.isMyNotation(this.getActiveNotation());
	}

	public isMyNotation(notation: NotationData): boolean {
		if (isUndefined(notation)) {
			return false;
		}
		return notation.userId === this.userProfileService.userId;
	}

	public addEphemeralNotation(notation: any, userId: string): void {
		this.ephemeralNotationMap.set(userId, notation);
	}

	private emitEphemeralChange(): void {
		this.ephemeralNotationChangeEvent.next();
	}

	get notations(): BoardNotationGroup[] {
		if (this.notationState) {
			const notations = [];
			for (let notation of this.notationState.notations) {
				if (this.rightsService.isEncounterGM() || notation.isVisible || this.isMyNotation(notation)) {
					notations.push(notation);
				}
			}
			return notations;
		}

		return [];
	}

	get notationsChangeObservable(): Observable<void> {
		return this.notationState.changeObservable;
	}

	get ephemerailNotationChangeObservable(): Observable<void> {
		return this.ephemeralNotationChangeEvent.asObservable();
	}
}

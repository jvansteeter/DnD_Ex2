import {Injectable} from '@angular/core';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {CellTarget} from '../shared/cell-target';
import {CellRegion} from '../shared/enum/cell-region';
import {BoardStateService} from './board-state.service';
import {BoardVisibilityService} from './board-visibility.service';
import {BoardTraverseService} from './board-traverse.service';
import {BoardLightService} from './board-light.service';
import {BoardDoor} from '../map-objects/board-door';
import { EncounterService } from '../../encounter/encounter.service';
import {BoardPlayerService} from "./board-player.service";
import { Observable, Subject } from 'rxjs';
import { IsReadyService } from '../../utilities/services/isReady.service';
import { isUndefined } from 'util';

@Injectable()
export class BoardWallService extends IsReadyService {
    private _wallData: Map<string, CellTarget> = new Map<string, CellTarget>();
    public doorData: Map<string, BoardDoor> = new Map<string, BoardDoor>();
    public windowData: Map<string, CellTarget> = new Map<string, CellTarget>();

    private wallChangeSubject: Subject<void> = new Subject();

    constructor(
        private boardStateService: BoardStateService,
        private boardVisibilityService: BoardVisibilityService,
        private boardTraverseService: BoardTraverseService,
        private boardLightService: BoardLightService,
        private boardPlayerService: BoardPlayerService,
        private encounterService: EncounterService,
    ) {
    	super(boardStateService, boardVisibilityService, boardTraverseService, boardLightService, boardPlayerService);
    }

    public init(): void {
        console.log('boardWallService: init()');
        this.dependenciesReady().subscribe((isReady) => {
    		if (isReady) {
    			this.wallData = this.encounterService.wallData;
                this.setReady(true);
            }
	    });
    }

    public unInit(): void {
        console.log('boardWallService: unInit()');
        delete this.wallData;
        this.setReady(false);
    }

    public addDoor(target: CellTarget) {
        if (!this.hasObstruction(target)) {
            this.doorData.set(target.hash(), new BoardDoor(target));
            switch (target.region) {
                case CellRegion.TOP_EDGE:
                    this.boardVisibilityService.blockNorth(target.location);
                    this.boardTraverseService.blockNorth(target.location);
                    break;
                case CellRegion.LEFT_EDGE:
                    this.boardVisibilityService.blockWest(target.location);
                    this.boardTraverseService.blockWest(target.location);
                    break;
                case CellRegion.FWRD_EDGE:
                    this.boardVisibilityService.blockFwd(target.location);
                    this.boardTraverseService.blockFwd(target.location);
                    break;
                case CellRegion.BKWD_EDGE:
                    this.boardVisibilityService.blockBkw(target.location);
                    this.boardTraverseService.blockBkw(target.location);
                    break;
            }
            this.boardLightService.updateAllLightValues();
            this.boardPlayerService.updateAllPlayerTraverse();
        }
    }

    public removeDoor(target: CellTarget) {
        if (this.hasObstruction(target) && this.doorData.has(target.hash())) {
            this.doorData.delete(target.hash());
            switch (target.region) {
                case CellRegion.TOP_EDGE:
                    this.boardVisibilityService.unblockNorth(target.location);
                    this.boardTraverseService.unblockNorth(target.location);
                    break;
                case CellRegion.LEFT_EDGE:
                    this.boardVisibilityService.unblockWest(target.location);
                    this.boardTraverseService.unblockWest(target.location);
                    break;
                case CellRegion.FWRD_EDGE:
                    this.boardVisibilityService.unblockFwd(target.location);
                    this.boardTraverseService.unblockFwd(target.location);
                    break;
                case CellRegion.BKWD_EDGE:
                    this.boardVisibilityService.unblockBkw(target.location);
                    this.boardTraverseService.unblockBkw(target.location);
                    break;
            }
        }
        this.boardLightService.updateAllLightValues();
        this.boardPlayerService.updateAllPlayerTraverse();
    }

    public toggleDoor(target: CellTarget) {
        if (this.hasObstruction(target) && this.doorData.has(target.hash())) {
            this.removeDoor(target);
        } else {
            this.addDoor(target);
        }
    }

    public openCloseDoor(target: CellTarget) {
        if (this.doorData.has(target.hash())) {
            if (this.doorData.get(target.hash()).isOpen) {
                this.doorData.get(target.hash()).isOpen = false;
                switch (target.region) {
                    case CellRegion.TOP_EDGE:
                        this.boardVisibilityService.blockNorth(target.location);
                        this.boardTraverseService.blockNorth(target.location);
                        break;
                    case CellRegion.LEFT_EDGE:
                        this.boardVisibilityService.blockWest(target.location);
                        this.boardTraverseService.blockWest(target.location);
                        break;
                    case CellRegion.FWRD_EDGE:
                        this.boardVisibilityService.blockFwd(target.location);
                        this.boardTraverseService.blockFwd(target.location);
                        break;
                    case CellRegion.BKWD_EDGE:
                        this.boardVisibilityService.blockBkw(target.location);
                        this.boardTraverseService.blockBkw(target.location);
                        break;
                }
            } else {
                this.doorData.get(target.hash()).isOpen = true;
                switch (target.region) {
                    case CellRegion.TOP_EDGE:
                        this.boardVisibilityService.unblockNorth(target.location);
                        this.boardTraverseService.unblockNorth(target.location);
                        break;
                    case CellRegion.LEFT_EDGE:
                        this.boardVisibilityService.unblockWest(target.location);
                        this.boardTraverseService.unblockWest(target.location);
                        break;
                    case CellRegion.FWRD_EDGE:
                        this.boardVisibilityService.unblockFwd(target.location);
                        this.boardTraverseService.unblockFwd(target.location);
                        break;
                    case CellRegion.BKWD_EDGE:
                        this.boardVisibilityService.unblockBkw(target.location);
                        this.boardTraverseService.unblockBkw(target.location);
                        break;
                }
            }
        }

        this.boardLightService.updateAllLightValues();
        this.boardPlayerService.updateAllPlayerTraverse();
    }

    public addWall(target: CellTarget) {
        this._addWall(target);
        this.wallChangeSubject.next();
		    this.boardLightService.updateAllLightValues();
		    this.boardPlayerService.updateAllPlayerTraverse();
    }

    private _addWall(target: CellTarget) {
	    if (!this.hasObstruction(target)) {
		    this._wallData.set(target.hash(), target);
		    switch (target.region) {
			    case CellRegion.TOP_EDGE:
				    this.boardVisibilityService.blockNorth(target.location);
				    this.boardTraverseService.blockNorth(target.location);
				    break;
			    case CellRegion.LEFT_EDGE:
				    this.boardVisibilityService.blockWest(target.location);
				    this.boardTraverseService.blockWest(target.location);
				    break;
			    case CellRegion.FWRD_EDGE:
				    this.boardVisibilityService.blockFwd(target.location);
				    this.boardTraverseService.blockFwd(target.location);
				    break;
			    case CellRegion.BKWD_EDGE:
				    this.boardVisibilityService.blockBkw(target.location);
				    this.boardTraverseService.blockBkw(target.location);
				    break;
		    }
	    }
    }

    public removeWall(target: CellTarget): void {
        if (this.hasObstruction(target) && this._wallData.has(target.hash())) {
            this._wallData.delete(target.hash());
            switch (target.region) {
                case CellRegion.TOP_EDGE:
                    this.boardVisibilityService.unblockNorth(target.location);
                    this.boardTraverseService.unblockNorth(target.location);
                    break;
                case CellRegion.LEFT_EDGE:
                    this.boardVisibilityService.unblockWest(target.location);
                    this.boardTraverseService.unblockWest(target.location);
                    break;
                case CellRegion.FWRD_EDGE:
                    this.boardVisibilityService.unblockFwd(target.location);
                    this.boardTraverseService.unblockFwd(target.location);
                    break;
                case CellRegion.BKWD_EDGE:
                    this.boardVisibilityService.unblockBkw(target.location);
                    this.boardTraverseService.unblockBkw(target.location);
                    break;
            }
        }
        this.boardLightService.updateAllLightValues();
        this.boardPlayerService.updateAllPlayerTraverse();
        this.wallChangeSubject.next();
    }

    public toggleWall(target: CellTarget): void {
        if (this.hasObstruction(target) && this._wallData.has(target.hash())) {
            this.removeWall(target);
        } else {
            this.addWall(target);
        }
    }

    public fillWallsBetweenCorners(corner1: XyPair, corner2: XyPair): void {
        const delta_x = corner2.x - corner1.x;
        const delta_y = corner2.y - corner1.y;
        const currentCell = corner1;

        const wallsToAdd: Array<CellTarget> = [];

        // handle up
        if ((delta_x === 0) && (delta_y < 0)) {
            while (currentCell.y !== corner2.y) {
                currentCell.y--;
                wallsToAdd.push(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.LEFT_EDGE));
            }
        }
        // handle down
        if ((delta_x === 0) && (delta_y > 0)) {
            while (currentCell.y !== corner2.y) {
                wallsToAdd.push(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.LEFT_EDGE));
                currentCell.y++;
            }
        }
        // handle left
        if ((delta_x < 0) && (delta_y === 0)) {
            while (currentCell.x !== corner2.x) {
                currentCell.x--;
                wallsToAdd.push(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.TOP_EDGE));
            }
        }
        // handle right
        if ((delta_x > 0) && (delta_y === 0)) {
            while (currentCell.x !== corner2.x) {
                wallsToAdd.push(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.TOP_EDGE));
                currentCell.x++;
            }
        }
        // handle up/right
        if ((delta_x > 0) && (delta_y < 0) && (Math.abs(delta_x) === (Math.abs(delta_y)))) {
            while (currentCell.x !== corner2.x) {
                currentCell.y--;
                wallsToAdd.push(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.FWRD_EDGE));
                currentCell.x++;
            }
        }
        // handle down/right
        if ((delta_x > 0) && (delta_y > 0 && (Math.abs(delta_x) === (Math.abs(delta_y))))) {
            while (currentCell.x !== corner2.x) {
                wallsToAdd.push(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.BKWD_EDGE));
                currentCell.y++;
                currentCell.x++;
            }
        }
        // handle down/left
        if ((delta_x < 0) && (delta_y > 0 && (Math.abs(delta_x) === (Math.abs(delta_y))))) {
            while (currentCell.x !== corner2.x) {
                currentCell.x--;
                wallsToAdd.push(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.FWRD_EDGE));
                currentCell.y++;
            }
        }
        // handle up/left
        if ((delta_x < 0) && (delta_y < 0 && (Math.abs(delta_x) === (Math.abs(delta_y))))) {
            while (currentCell.x !== corner2.x) {
                currentCell.x--;
                currentCell.y--;
                wallsToAdd.push(new CellTarget(new XyPair(currentCell.x, currentCell.y), CellRegion.BKWD_EDGE));
            }
        }

        // add the walls to the wallService
        for (let i = 0; i < wallsToAdd.length - 1; i++) {
            this._addWall(wallsToAdd[i]);
        }
        this.addWall(wallsToAdd[wallsToAdd.length - 1]);

        this.boardLightService.updateAllLightValues();
        this.boardPlayerService.updateAllPlayerTraverse();
    }

    public hasObstruction(target: CellTarget): boolean {
        return this._wallData.has(target.hash()) || this.doorData.has(target.hash()) || this.windowData.has(target.hash());
    }

    get wallChangeEvent(): Observable<void> {
    	return this.wallChangeSubject.asObservable();
    }

    get wallData(): {} {
    	const data = {};
    	for (let key of this._wallData.keys()) {
    		data[key] = this._wallData.get(key).serialize();
	    }

	    return data;
    }

    get walls(): IterableIterator<CellTarget> {
    	if (isUndefined(this._wallData)) {
    		return new Map<string, CellTarget>().values();
	    }
    	return this._wallData.values();
    }

    set wallData(data: {}) {
    	this._wallData = new Map();
    	for (let key in data) {
    		let newTarget = new CellTarget(new XyPair(data[key].location.x, data[key].location.y), data[key].region);
		    this._addWall(newTarget);
	    }
	    this.boardLightService.updateAllLightValues();
	    this.boardPlayerService.updateAllPlayerTraverse();
    }
}

import {Injectable} from '@angular/core';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';
import {CellTarget} from '../shared/cell-target';
import {CellRegion} from '../shared/enum/cell-region';
import {BoardStateService} from './board-state.service';
import {BoardVisibilityService} from './board-visibility.service';
import {BoardTraverseService} from './board-traverse.service';
import {BoardLightService} from './board-light.service';
import {BoardDoor} from '../map-objects/board-door';
import {EncounterService} from '../../encounter/encounter.service';
import {BoardPlayerService} from "./board-player.service";
import {Observable, Subject} from 'rxjs';
import {IsReadyService} from '../../utilities/services/isReady.service';
import {isUndefined} from 'util';
import {BoardWindow} from "../map-objects/board-window";

@Injectable()
export class BoardWallService extends IsReadyService {
    private _wallData: Map<string, CellTarget> = new Map<string, CellTarget>();
    private _doorData: Map<string, BoardDoor> = new Map<string, BoardDoor>();
    public _windowData: Map<string, BoardWindow> = new Map<string, BoardWindow>();

    private wallChangeSubject: Subject<void> = new Subject();
    private doorChangeSubject: Subject<void> = new Subject();

    constructor(
        private boardStateService: BoardStateService,
        private boardVisibilityService: BoardVisibilityService,
        private boardTraverseService: BoardTraverseService,
        private boardLightService: BoardLightService,
        private boardPlayerService: BoardPlayerService,
        private encounterService: EncounterService,
    ) {
        super(boardStateService, boardVisibilityService, boardTraverseService, boardLightService, boardPlayerService, encounterService);
    }

    public init(): void {
        this.dependenciesSub = this.dependenciesReady().subscribe((isReady) => {
            if (isReady && !this.isReady()) {
                console.log('boardWallService.init() -> isReady');
                this.wallData = this.encounterService.wallData;
                this.doorData = this.encounterService.doorData;
                this.updateLightAndTraverse();
                this.setReady(true);
            }
        });
    }

    public unInit(): void {
        console.log('boardWallService.unInit()');
        delete this.wallData;
        this.setReady(false);
    }

    public toggleWindow(target: CellTarget) {
        if (this.hasObstruction(target) && this._windowData.has(target.hash())) {
            this.removeWindow(target);
        } else {
            this.addWindow(target);
        }
    }

    public addWindow(target: CellTarget) {
        this._addWindow(target);
        this.updateLightAndTraverse();
        // trigger the window change subject
    }

    public _addWindow(target: CellTarget, isOpen = false) {
        if (!this.hasObstruction(target)) {
            this._windowData.set(target.hash(), new BoardWindow(target));
            this.boardVisibilityService.blockCellTarget(target);
            this.boardTraverseService.blockCellTarget(target);
        }
    }

    public removeWindow(target: CellTarget) {
        if (this.hasObstruction(target) && this._windowData.has(target.hash())) {
            this._windowData.delete(target.hash());
            this.boardVisibilityService.unblockCellTarget(target);
            this.boardTraverseService.unblockCellTarget(target);
        }
        this.updateLightAndTraverse();
    }

    public addDoor(target: CellTarget) {
        this._addDoor(target);
        this.updateLightAndTraverse();
        this.doorChangeSubject.next();
    }

    private _addDoor(target: CellTarget, isOpen = false): void {
        if (!this.hasObstruction(target)) {
            this._doorData.set(target.hash(), new BoardDoor(target, isOpen));
            this.boardVisibilityService.blockCellTarget(target);
            this.boardTraverseService.blockCellTarget(target);
        }
    }

    public removeDoor(target: CellTarget) {
        if (this.hasObstruction(target) && this._doorData.has(target.hash())) {
            this._doorData.delete(target.hash());
            this.boardVisibilityService.unblockCellTarget(target);
            this.boardTraverseService.unblockCellTarget(target);
        }
        this.updateLightAndTraverse();
    }

    public toggleDoor(target: CellTarget) {
        if (this.hasObstruction(target) && this._doorData.has(target.hash())) {
            this.removeDoor(target);
        } else {
            this.addDoor(target);
        }
    }

    public openCloseDoor(target: CellTarget) {
        if (this._doorData.has(target.hash())) {
            if (this._doorData.get(target.hash()).isOpen) {
                this._doorData.get(target.hash()).isOpen = false;
                this.boardVisibilityService.blockCellTarget(target);
                this.boardTraverseService.blockCellTarget(target);
            } else {
                this._doorData.get(target.hash()).isOpen = true;
                this.boardVisibilityService.unblockCellTarget(target);
                this.boardTraverseService.unblockCellTarget(target);
            }
            this.updateLightAndTraverse();
            this.doorChangeSubject.next();
        }
    }

    public addWall(target: CellTarget) {
        this._addWall(target);
        this.updateLightAndTraverse();
        this.wallChangeSubject.next();
    }

    private _addWall(target: CellTarget) {
        if (!this.hasObstruction(target)) {
            this._wallData.set(target.hash(), target);
            this.boardVisibilityService.blockCellTarget(target);
            this.boardTraverseService.blockCellTarget(target);
        }
    }

    public removeWall(target: CellTarget): void {
        if (this.hasObstruction(target) && this._wallData.has(target.hash())) {
            this._wallData.delete(target.hash());
            this.boardVisibilityService.unblockCellTarget(target);
            this.boardTraverseService.unblockCellTarget(target);
        }
        this.updateLightAndTraverse();
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
        this.updateLightAndTraverse()
    }

    public hasObstruction(target: CellTarget): boolean {
        return this._wallData.has(target.hash()) || this._doorData.has(target.hash()) || this._windowData.has(target.hash());
    }

    get wallChangeEvent(): Observable<void> {
        return this.wallChangeSubject.asObservable();
    }

    get doorChangeEvent(): Observable<void> {
        return this.doorChangeSubject.asObservable();
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
    }

    set doorData(data: Object) {
        this._doorData = new Map();
        for (let key in data) {
            let newTarget = new CellTarget(new XyPair(data[key].target.location.x, data[key].target.location.y), data[key].target.region);
            this._addDoor(newTarget, data[key].isOpen);
        }
    }

    get doorData(): Object {
        const data = {};
        for (let key of this._doorData.keys()) {
            data[key] = {
                isOpen: this._doorData.get(key).isOpen,
                target: this._doorData.get(key).target.serialize(),
            };
        }

        return data;
    }

    get doors(): IterableIterator<BoardDoor> {
        if (isUndefined(this._doorData)) {
            return new Map<string, BoardDoor>().values();
        }
        return this._doorData.values();
    }

    get windowData(): Object {
        const data = {};
        for (let key of this._windowData.keys()) {
            data[key] = {
                isTransparent: this._windowData.get(key).isTransparent,
                isBlocking: this._windowData.get(key).isBlocking,
                target: this._windowData.get(key).target.serialize(),
            };
        }

        return data;
    }

    get windows(): IterableIterator<BoardWindow> {
        if (isUndefined(this._windowData)) {
            return new Map<string, BoardWindow>().values();
        }
        return this._windowData.values();
    }

    set windowData(data: Object) {
        this._windowData = new Map();
        for (let key in data) {
            let newTarget = new CellTarget(new XyPair(data[key].target.location.x, data[key].target.location.y), data[key].target.region);
            this._addWindow(newTarget, data[key].isTransparent. data[key].isBlocking);
        }
    }

    public updateLightAndTraverse(): void {
        this.boardLightService.updateAllLightValues();
        this.boardPlayerService.updateAllPlayerVisibility();
        this.boardPlayerService.updateAllPlayerLightSource();
        this.boardPlayerService.updateAllPlayerTraverse();
    }
}

import {Component, ViewChild, ElementRef, OnInit, HostListener, AfterViewInit, AfterViewChecked} from '@angular/core';
import {BoardService} from "../services/board.service";
import {BoardCanvasService} from "../services/board-canvas.service";
import {BoardStateService} from "../services/board-state.service";
import {BoardWallService} from "../services/board-wall.service";
import {BoardTileService} from "../services/board-tile.service";
import {XyPair} from '../geometry/xy-pair';
import {BoardTransformService} from '../services/board-transform.service';
import {EncounterService} from '../../encounter/encounter.service';


@Component({
    selector: 'board-map',
    templateUrl: 'board-map.component.html',
    styleUrls: ['board-map.component.scss']
})

/*************************************************************************************************************************************
 * BoardComponent
 *************************************************************************************************************************************
 * RESPONSIBLE FOR ...
 * - interfacing with the canvas component in the html, functionally passes the responsibility of 'VIEW' to the renderer classes
 * --- sets the canvas height and width
 * --- starts the render loop
 *
 * - handling user input, clicks and key presses, ultimately passing all to the BoardService
 *
 * - Manual loader for passing references to Service classes
 */

export class BoardMapComponent implements OnInit, AfterViewChecked {
    @ViewChild('inputCanvas') inputCanvas: ElementRef;
    @ViewChild('mapContainer') mapContainer: ElementRef;

    private ctx: CanvasRenderingContext2D;

    constructor(
        private boardService: BoardService,
        private boardCanvasService: BoardCanvasService,
        private boardStateService: BoardStateService,
        private boardTransformService: BoardTransformService,
        private encounterService: EncounterService
    ) {
    }

    ngOnInit(): void {
        this.ctx = this.inputCanvas.nativeElement.getContext('2d');
        this.boardCanvasService.cvs_height = this.mapContainer.nativeElement.clientHeight;
        this.boardCanvasService.cvs_width = this.mapContainer.nativeElement.clientWidth;
        this.boardStateService.mapOffsetTop = this.mapContainer.nativeElement.offsetTop;
        this.boardStateService.mapOffsetLeft = this.mapContainer.nativeElement.offsetLeft;
    }

    ngAfterViewChecked(): void {
        this.boardCanvasService.canvasNativeElement = this.mapContainer.nativeElement;
    }

    getCanvasHeight(): number {
        return this.boardCanvasService.cvs_height;
    }

    getCanvasWidth(): number {
        return this.boardCanvasService.cvs_width;
    }

    clickResponse(): void {
        this.boardService.handleClickResponse();
    }

    mouseMove(event): void {
        // this.boardService.handleMouseMove(event);
        const mouse_screen = new XyPair(event.clientX, event.clientY);

        if (this.boardStateService.mouseLeftDown) {
            if ((window.performance.now() - this.boardStateService.mouseLeftDownStartTime) > 90) {
                this.boardStateService.mouseDrag = true;
                const trans_coor = this.boardTransformService.screen_to_map(event);

                const deltaX = this.boardStateService.mouse_loc_map.x - trans_coor.x;
                const deltaY = this.boardStateService.mouse_loc_map.y - trans_coor.y;

                this.boardStateService.x_offset -= (deltaX * this.boardStateService.scale);
                this.boardStateService.y_offset -= (deltaY * this.boardStateService.scale);
            }
        }

        this.updateMouseLocation(mouse_screen);


        this.encounterService.checkForPops(
            new XyPair(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y),
            this.boardTransformService.map_to_screen(new XyPair((this.boardStateService.mouse_loc_cell.x + 1) * this.boardStateService.cell_res,((this.boardStateService.mouse_loc_cell.y) * this.boardStateService.cell_res)))
        );
    }

    handleMouseUp(event) {
        switch (event.which) {
            case 1:
                this.boardService.handleMouseLeftUp(event);
                break;
            case 2:
                break;
            case 3:
                this.boardService.handleMouseRightUp(event);
                break;
        }
    }

    handleMouseDown(event) {
        switch (event.which) {
            case 1:
                this.boardService.handleMouseLeftDown(event);
                break;
            case 2:
                break;
            case 3:
                this.boardService.handleMouseRightDown(event);
                break;
        }
    }

    handleMouseWheel(event) {
        // this.boardService.handleMouseScroll(event.deltaY);
        const scroll_scale_delta = 0.10;
        const max_scale = 2.50;
        const min_scale = 0.35;

        const start_scale = this.boardStateService.scale;

        const preferred_scale_delta = (-event.deltaY / 100) * scroll_scale_delta;
        const preferred_new_scale = start_scale + preferred_scale_delta;

        let new_scale_delta;

        if (preferred_new_scale >= max_scale) {
            new_scale_delta = start_scale - max_scale;
        } else if (preferred_new_scale <= min_scale) {
            new_scale_delta = min_scale - start_scale;
        } else {
            new_scale_delta = preferred_scale_delta;
        }

        const x_delta = -(this.boardStateService.mouse_loc_map.x * new_scale_delta);
        const y_delta = -(this.boardStateService.mouse_loc_map.y * new_scale_delta);

        this.boardStateService.scale += new_scale_delta;
        this.boardStateService.x_offset += x_delta;
        this.boardStateService.y_offset += y_delta;
    }

    handleMouseLeave(event) {
        // this.boardService.handleMouseLeave();
        this.clearMouseLocation();
        this.boardStateService.mouseLeftDown = false;
    }

    handleMouseEnter(event) {
        this.boardService.handleMouseEnter();
    }

    handleContextMenu(event) {
        return false;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.boardCanvasService.canvasNativeElement = this.mapContainer.nativeElement;
        this.boardCanvasService.cvs_height = this.mapContainer.nativeElement.clientHeight;
        this.boardCanvasService.cvs_width = this.mapContainer.nativeElement.clientWidth;
        this.boardStateService.mapOffsetTop = this.mapContainer.nativeElement.offsetTop;
        this.boardStateService.mapOffsetLeft = this.mapContainer.nativeElement.offsetLeft;
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDownEvent(event: KeyboardEvent) {
        const key_code = event.code;
        switch (key_code) {
            case 'ShiftLeft' :
                this.boardStateService.shiftDown = true;
                this.refreshMouseLocation();
                break;
            case 'ShiftRight' :
                break;
            case 'Space' :
                this.boardStateService.spaceDown = true;
                break;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUpEvent(event: KeyboardEvent) {
        const key_code = event.code;
        switch (key_code) {
            case 'ShiftLeft' :
                this.boardStateService.shiftDown = false;
                this.refreshMouseLocation();
                break;
            case 'ShiftRight' :
                break;
            case 'Space' :
                this.boardStateService.spaceDown = false;
                break;
            case 'Escape':
                this.boardStateService.source_click_location = null;
                break;
        }
    }

    updateMouseLocation(location: XyPair): void {
        // UPDATE GLOBAL MOUSE LOCATIONS
        this.boardStateService.mouse_loc_screen = location;
        this.boardStateService.mouse_loc_canvas = this.boardTransformService.screen_to_canvas(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_map = this.boardTransformService.screen_to_map(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_cell = this.boardTransformService.screen_to_cell(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_cell_pix = new XyPair(this.boardStateService.mouse_loc_map.x - (this.boardStateService.mouse_loc_cell.x * this.boardStateService.cell_res), this.boardStateService.mouse_loc_map.y - (this.boardStateService.mouse_loc_cell.y * this.boardStateService.cell_res));
        this.boardStateService.mouse_cell_target = this.boardTransformService.calculate_cell_target(this.boardStateService.mouse_loc_cell_pix);
        this.boardStateService.mouseOnMap = this.coorInBounds(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y);
    }

    refreshMouseLocation(): void {
        this.boardStateService.mouse_loc_canvas = this.boardTransformService.screen_to_canvas(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_map = this.boardTransformService.screen_to_map(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_cell = this.boardTransformService.screen_to_cell(this.boardStateService.mouse_loc_screen);
        this.boardStateService.mouse_loc_cell_pix = new XyPair(this.boardStateService.mouse_loc_map.x - (this.boardStateService.mouse_loc_cell.x * this.boardStateService.cell_res), this.boardStateService.mouse_loc_map.y - (this.boardStateService.mouse_loc_cell.y * this.boardStateService.cell_res));
        this.boardStateService.mouse_cell_target = this.boardTransformService.calculate_cell_target(this.boardStateService.mouse_loc_cell_pix);
        this.boardStateService.mouseOnMap = this.coorInBounds(this.boardStateService.mouse_loc_cell.x, this.boardStateService.mouse_loc_cell.y);
    }

    clearMouseLocation(): void {
        this.boardStateService.mouse_loc_canvas = null;
        this.boardStateService.mouse_loc_map = null;
        this.boardStateService.mouse_loc_cell = null;
        this.boardStateService.mouse_loc_cell_pix = null;
        this.boardStateService.mouse_cell_target = null;
        this.boardStateService.mouseOnMap = false;
    }

    coorInBounds(x: number, y: number): boolean {
        return !((x >= this.boardStateService.mapDimX) || (y >= this.boardStateService.mapDimY) || (x < 0) || (y < 0));
    }
}

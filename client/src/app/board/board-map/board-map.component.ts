import {Component, ViewChild, ElementRef, OnInit, HostListener, AfterViewInit, AfterViewChecked} from '@angular/core';
import {BoardService} from "../services/board.service";
import {BoardCanvasService} from "../services/board-canvas-service";
import {BoardStateService} from "../services/board-state.service";
import {WallService} from "../services/wall.service";
import {TileService} from "../services/tile.service";


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
        private bs: BoardService,
        private boardCanvasService: BoardCanvasService,
        private boardStateService: BoardStateService
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
        this.bs.handleClickResponse();
    }

    mouseMove(event): void {
        this.bs.handleMouseMove(event);
    }

    handleMouseUp(event) {
        this.bs.handleMouseUp(event);
    }

    handleMouseDown(event) {
        this.bs.handleMouseDown(event);
    }

    handleMouseWheelUp(event) {
        this.bs.handleMouseScroll(event.deltaY);
    }

    handleMouseWheelDown(event) {
        this.bs.handleMouseScroll(event.deltaY);
    }

    handleMouseLeave(event) {
        this.bs.handleMouseLeave();
    }

    handleMouseEnter(event) {
        this.bs.handleMouseEnter();
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
                this.bs.shiftDown = true;
                this.bs.refreshMouseLocation();
                break;
            case 'ShiftRight' :
                break;
            case 'Space' :
                this.bs.spaceDown = true;
                break;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUpEvent(event: KeyboardEvent) {
        const key_code = event.code;
        switch (key_code) {
            case 'ShiftLeft' :
                this.bs.shiftDown = false;
                this.bs.refreshMouseLocation();
                break;
            case 'ShiftRight' :
                break;
            case 'Space' :
                this.bs.spaceDown = false;
                break;
            case 'Escape':
                this.bs.source_click_location = null;
                break;
        }
    }
}

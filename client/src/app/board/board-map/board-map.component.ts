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
        private boardService: BoardService,
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
        this.boardService.handleClickResponse();
    }

    mouseMove(event): void {
        this.boardService.handleMouseMove(event);
    }

    handleMouseUp(event) {
        this.boardService.handleMouseUp(event);
    }

    handleMouseDown(event) {
        this.boardService.handleMouseDown(event);
    }

    handleMouseWheelUp(event) {
        this.boardService.handleMouseScroll(event.deltaY);
    }

    handleMouseWheelDown(event) {
        this.boardService.handleMouseScroll(event.deltaY);
    }

    handleMouseLeave(event) {
        this.boardService.handleMouseLeave();
    }

    handleMouseEnter(event) {
        this.boardService.handleMouseEnter();
    }

    handleContextMenu(event) {
        // Produce a permanent context menu
        // if (!this.secondaryIsActive) {
        //     timer(0)
        //         .subscribe((x) => {
        //             this.secondaryIsHover = false;
        //             this.secondaryIsActive = true;
        //             this.addComponent(false, this.purpleRef.nativeElement.offsetLeft + this.purpleRef.nativeElement.offsetWidth, this.purpleRef.nativeElement.offsetTop, 200, 50);
        //         });
        // } else {
        //     if (this.secondaryIsHover) {
        //         this.destroyComponent();
        //         this.secondaryIsHover = false;
        //         this.secondaryIsActive = true;
        //         this.addComponent(false, this.purpleRef.nativeElement.offsetLeft + this.purpleRef.nativeElement.offsetWidth, this.purpleRef.nativeElement.offsetTop, 200, 50);
        //     }
        // }
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
                this.boardService.shiftDown = true;
                this.boardService.refreshMouseLocation();
                break;
            case 'ShiftRight' :
                break;
            case 'Space' :
                this.boardService.spaceDown = true;
                break;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUpEvent(event: KeyboardEvent) {
        const key_code = event.code;
        switch (key_code) {
            case 'ShiftLeft' :
                this.boardService.shiftDown = false;
                this.boardService.refreshMouseLocation();
                break;
            case 'ShiftRight' :
                break;
            case 'Space' :
                this.boardService.spaceDown = false;
                break;
            case 'Escape':
                this.boardService.source_click_location = null;
                break;
        }
    }
}

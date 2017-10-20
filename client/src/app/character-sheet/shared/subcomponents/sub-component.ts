import { Aspect, AspectType } from '../aspect';
import {
    AfterViewInit, Component, HostListener, Input, OnInit, Renderer2,
    ViewChild
} from '@angular/core';
import { SubComponentChild } from './sub-component-child';
import { CharacterMakerService, Move } from '../../maker/character-maker.service';
import { MatMenu } from '@angular/material';

@Component({
    selector: 'sub-component',
    templateUrl: 'sub-component.html',
    styleUrls: ['sub-component.css']
})
export class SubComponent implements OnInit, AfterViewInit {
    @Input() aspect: Aspect;
    @ViewChild('child') child: SubComponentChild;
    options: MatMenu;
    aspectType = AspectType;

    minHeight: number;
    minWidth: number;

    zIndex = 0;
    isHovered: boolean = false;
    optionsOpen: boolean = false;

    readonly animation = 'transform 200ms ease-out';
    readonly noAnimation = '';
    readonly footerHeight = 24;
    readonly headerHeight = 24;
    transition = this.animation;
    transform = '';

    @HostListener('mouseenter')
    hover(): void {
        this.zIndex = 1;
        this.isHovered = true;
    }

    @HostListener('mouseleave')
    stopHover(): void {
        if (!this.optionsOpen) {
            this.zIndex = 0;
            this.isHovered = false;
        }
    }

    private resizing: boolean = false;
    private moving: boolean = false;

    constructor(renderer: Renderer2, private characterMakerService: CharacterMakerService) {
        renderer.listen('document', 'mousemove', (event) => {
            if (this.resizing) {
                let newWidth = this.aspect.width + event.movementX;
                let newHeight = this.aspect.height + event.movementY;
                this.resize(newWidth, newHeight);
                this.characterMakerService.adjustCharacterSheetHeight();
            }
            if (this.moving) {
                let directions: Move[] = [];
                if (event.movementX > 0) {
                    directions.push(Move.RIGHT);
                }
                else {
                    directions.push(Move.LEFT);
                }
                if (event.movementY > 0) {
                    directions.push(Move.DOWN);
                }
                else {
                    directions.push(Move.UP);
                }
                let newTop = this.aspect.top + event.movementY;
                let newLeft = this.aspect.left + event.movementX;
                if (newTop >= 0) {
                    this.aspect.top = newTop;
                }
                if (newLeft >= 0 && newLeft + this.aspect.width < this.getMaxWidth()) {
                    this.aspect.left = newLeft;
                    this.characterMakerService.adjustCharacterSheetHeight();
                }
            }
        });

        renderer.listen('document', 'mouseup', () => {
            if (this.moving || this.resizing) {
                this.characterMakerService.reorderAnimation(this);
            }

            this.resizing = false;
            this.moving = false;
            this.stopHover();
        });
    }

    ngAfterViewInit(): void {
        this.characterMakerService.registerSubComponent(this);
        this.options = this.child.getMenuOptions();
    }

    ngOnInit(): void {
        switch (this.aspect.aspectType) {
            case AspectType.TEXT: {
                this.setDimensions(192, 50);
                break;
            }
            case AspectType.BOOLEAN: {
                this.setDimensions(67, 1);
                break;
            }
            case AspectType.NUMBER: {
                this.setDimensions(85,25);
                break;
            }
            case AspectType.BOOLEAN_LIST: {
                this.setDimensions(67, 1);
                break;
            }
            case AspectType.TEXT_LIST: {
                this.setDimensions(192, 25);
                break;
            }
            case AspectType.CATEGORICAL: {
                this.setDimensions(125, 35);
                break;
            }
            case AspectType.TOKEN: {
                this.setDimensions(70, 50);
                break;
            }
            case AspectType.FUNCTION: {
                this.setDimensions(65, 20);
                break;
            }

            default: {
                throw new Error('Unknown aspect type');
            }
        }
    }

    resize(width: number, height: number): void {
        if (width >= this.minWidth &&
            this.aspect.left + width <= this.getMaxWidth()) {
            this.aspect.width = width;
        }
        if (height >= this.minHeight) {
            this.aspect.height = height;
        }
        this.child.resize(width, height);
    }

    setDimensions(width: number, height: number) {
        this.minWidth = width;
        this.minHeight = height;
        if (this.aspect.isNew) {
            this.aspect.width = width;
            this.aspect.height = height;
        }
    }

    getValue(): any {
        return this.child.getValue();
    }

    startDrag(): void {
        this.resizing = true;
        this.hover();
    }

    startMove(): void {
        this.moving = true;
        this.showAnimation(false);
        this.hover();
    }

    remove(): void {
        this.characterMakerService.removeComponent(this.aspect);
    }

    animate(x: number, y: number): void {
        this.showAnimation(true);
        if (this.aspect.top + y > 0) {
            this.aspect.top += y;
        }
        if (this.aspect.left + x > 0 && this.right() + x <= this.getMaxWidth()) {
            this.aspect.left += x;
        }
    }

    animateTo(x: number, y: number): void {
        this.showAnimation(true);
        if (y > 0) {
            this.aspect.top = y;
        }
        if (x > 0 && this.aspect.width + x <= this.getMaxWidth()) {
            this.aspect.left = x;
        }
    }

    canMoveRightTo(x: number): boolean {
        return x > 0 && this.aspect.width + x <= this.getMaxWidth();
    }

    overlaps(other: SubComponent): boolean {
        let thisRight = this.aspect.left + this.aspect.width;
        let thisBottom = this.aspect.top + this.getTotalHeight();
        let otherRight = other.aspect.left + other.aspect.width;
        let otherBottom = other.aspect.top + other.getTotalHeight();

        if (this.aspect.top === other.aspect.top && this.aspect.left === other.aspect.left) {
            return true;
        }

        if (this.aspect.left <= other.aspect.left && thisRight > other.aspect.left ||
            other.aspect.left <= this.aspect.left && otherRight > this.aspect.left) {
            if (this.aspect.top <= other.aspect.top && thisBottom > other.aspect.top ||
                other.aspect.top <= this.aspect.top && otherBottom > this.aspect.top) {
                return true;
            }
        }

        return false;
    }

    overlapsRightSide(stationary: SubComponent): boolean {
        return this.overlaps(stationary) && this.aspect.left > stationary.aspect.left;
    }

    overlapsLeftSide(stationary: SubComponent): boolean {
        return this.overlaps(stationary) && this.right() < stationary.right();
    }

    overlapsTopSide(stationary: SubComponent): boolean {
        return this.overlaps(stationary) && this.bottom() > stationary.bottom();
    }

    overlapsBottomSide(stationary: SubComponent): boolean {
        return this.overlaps(stationary) && this.aspect.top > stationary.aspect.top;
    }

    violatesRightTerritory(other: SubComponent) {
        return other.aspect.left < (this.aspect.left + this.aspect.width);
    }

    getTotalHeight(): number {
        return this.aspect.height + this.footerHeight + this.headerHeight;
    }

    openOptions(): void {
        this.optionsOpen = true;
    }

    closeOptions(): void {
        this.optionsOpen = false;
        this.stopHover();
    }

    private showAnimation(show: boolean): void {
        if (show) {
            this.transition = this.animation;
        }
        else {
            this.transition = this.noAnimation;
        }
    }

    private getMaxWidth(): number {
        return window.innerWidth - 100;
    }

    right(): number {
        return this.aspect.left + this.aspect.width;
    }

    bottom(): number {
        return this.aspect.top + this.aspect.height;
    }
}
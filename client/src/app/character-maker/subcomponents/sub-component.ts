import { Aspect, AspectType } from '../aspect';
import {
    AfterViewInit, Component, HostListener, Input, OnInit, Renderer2,
    ViewChild
} from '@angular/core';
import { SubComponentChild } from './sub-component-child';
import { CharacterMakerService, Move } from '../character-maker.service';
import { Observable } from 'rxjs/Observable';
import { MdMenu } from '@angular/material';

@Component({
    selector: 'sub-component',
    templateUrl: 'sub-component.html',
    styleUrls: ['sub-component.css']
})
export class SubComponent implements OnInit, AfterViewInit {
    @Input() aspect: Aspect;
    @ViewChild('child') child: SubComponentChild;
    options: MdMenu;
    aspectType = AspectType;

    width: number;
    height: number;
    minHeight: number;
    minWidth: number;

    top: number = 0;
    left: number = 0;
    zIndex = 0;
    isHovered: boolean = false;
    optionsOpen: boolean = false;

    readonly animation = 'transform 200ms ease-out';
    readonly noAnimation = '';
    readonly footerHeight = 24;
    readonly headerHeight = 24;
    transition = this.animation;
    transform = '';

    value: any;

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
                let newWidth = this.width + event.movementX;
                let newHeight = this.height + event.movementY;
                this.resize(newWidth, newHeight);
                this.characterMakerService.reorderAnimation(this, []);
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
                let newTop = this.top + event.movementY;
                let newLeft = this.left + event.movementX;
                if (newTop >= 0) {
                    this.top = newTop;
                }
                if (newLeft >= 0 && newLeft + this.width < this.getMaxWidth()) {
                    this.left = newLeft;
                    this.characterMakerService.reorderAnimation(this, directions);
                }
            }
        });

        renderer.listen('document', 'mouseup', () => {
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
                this.setDimensions(125, 15);
                break;
            }

            default: {
                throw new Error('Unknown aspect type');
            }
        }
    }

    resize(width: number, height: number): void {
        if (width >= this.minWidth &&
            this.left + width <= this.getMaxWidth()) {
            this.width = width;
        }
        if (height >= this.minHeight) {
            this.height = height;
        }
        this.child.resize(width, height);
        this.characterMakerService.reorderAnimation(this, []);
    }

    setDimensions(width: number, height: number) {
        this.width = width;
        this.minWidth = width;
        this.height = height;
        this.minHeight = height;
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
        if (this.top + y > 0) {
            this.top += y;
        }
        if (this.left + x > 0 && this.right() + x <= this.getMaxWidth()) {
            this.left += x;
        }
    }

    overlaps(other: SubComponent): boolean {
        let thisRight = this.left + this.width;
        let thisBottom = this.top + this.height;
        let otherRight = other.left + other.width;
        let otherBottom = other.top + other.height;

        if (this.top === other.top && this.left === other.left) {
            return true;
        }

        if (this.left <= other.left && thisRight > other.left ||
            other.left <= this.left && otherRight > this.left) {
            if (this.top <= other.top && thisBottom > other.top ||
                other.top <= this.top && otherBottom > this.top) {
                return true;
            }
        }

        return false;
    }

    overlapsRightSide(stationary: SubComponent): boolean {
        return this.overlaps(stationary) && this.left > stationary.left;
    }

    overlapsLeftSide(stationary: SubComponent): boolean {
        return this.overlaps(stationary) && this.right() < stationary.right();
    }

    overlapsTopSide(stationary: SubComponent): boolean {
        return this.overlaps(stationary) && this.bottom() > stationary.bottom();
    }

    overlapsBottomSide(stationary: SubComponent): boolean {
        return this.overlaps(stationary) && this.top > stationary.top;
    }

    violatesRightTerritory(other: SubComponent) {
        return other.left < (this.left + this.width);
    }

    getTotalHeight(): number {
        return this.height + this.footerHeight + this.headerHeight;
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

    private right(): number {
        return this.left + this.width;
    }

    private bottom(): number {
        return this.top + this.height;
    }
}
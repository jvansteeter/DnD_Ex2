import { Aspect, AspectType } from '../aspect';
import {
    AfterViewInit, Component, HostListener, Input, OnInit, Renderer2,
    ViewChild
} from '@angular/core';
import { SubComponentChild } from './sub-component-child';
import { CharacterMakerService, Move } from '../character-maker.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'sub-component',
    templateUrl: 'sub-component.html',
    styleUrls: ['sub-component.css']
})
export class SubComponent implements OnInit, AfterViewInit {
    ngAfterViewInit(): void {
        // console.log('this.child');
        // console.log(this.child);
        this.characterMakerService.registerSubComponent(this);
    }

    ngOnInit(): void {
        switch (this.aspect.aspectType) {
            case AspectType.text: {
                this.setDimensions(192, 120);
                break;
            }
            case AspectType.boolean: {
                this.setDimensions(67, 72);
                break;
            }

            default: {
                throw new Error('Unknown aspect type');
            }
        }
    }

    @Input() aspect: Aspect;
    @ViewChild('child') child: SubComponentChild;
    aspectType = AspectType;

    width: number;
    height: number;
    minHeight: number;
    minWidth: number;

    top: number = 0;
    left: number = 0;
    zIndex = 0;

    readonly animation = 'transform 200ms ease-out';
    readonly noAnimation = '';
    transition = this.animation;
    transform = '';

    value: any;

    @HostListener('mouseenter')
    hover(): void {
        this.zIndex = 1;
    }

    @HostListener('mouseleave')
    stopHover(): void {
        this.zIndex = 0;
    }

    private resizing: boolean = false;
    private moving: boolean = false;

    constructor(renderer: Renderer2, private characterMakerService: CharacterMakerService) {
        renderer.listen('document', 'mousemove', (event) => {
            if (this.resizing) {
                let newWidth = this.width + event.movementX;
                if (newWidth > this.minWidth &&
                    newWidth < this.getMaxWidth()) {
                    this.width = newWidth;
                }
                let newHeight = this.height + event.movementY;
                if (newHeight > this.minHeight) {
                    this.height = newHeight;
                }
                this.child.resize(newWidth, newHeight);
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
                if (newLeft >= 0) {
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
        this.transition = this.noAnimation;
        this.hover();
    }

    remove(): void {
        this.characterMakerService.removeComponent(this.aspect);
    }

    animate(x: number, y: number): void {
        console.log('i was told to move ' + x + ' to the left and ' + y + ' down')
        this.transition = this.animation;
        this.top += y;
        this.left += x;
        // this.transform = 'translate(' + x + 'px, ' + y + 'px)';
        Observable.timer(2000).subscribe(() => {
            this.transition = this.noAnimation;
        });
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
        return this.overlaps(stationary) && (this.left + this.width) > (stationary.left + stationary.width);
    }

    overlapsTopSide(stationary: SubComponent): boolean {
        return this.overlaps(stationary) && (this.top + this.height) > (stationary.top + stationary.height);
    }

    overlapsBottomSide(stationary: SubComponent): boolean {
        return this.overlaps(stationary) && this.top > stationary.top;
    }

    violatesRightTerritory(other: SubComponent) {
        return other.left < (this.left + this.width);
    }

    private getMaxWidth(): number {
        return window.innerWidth - 100;
    }
}
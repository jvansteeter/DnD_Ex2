import { Aspect, AspectType } from '../aspect';
import {
    AfterViewInit, Component, HostListener, Input, OnInit, Renderer2,
    ViewChild
} from '@angular/core';
import { SubComponentChild } from './sub-component-child';
import { CharacterMakerService } from '../character-maker.service';
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
    }

    ngOnInit(): void {
        switch (this.aspect.aspectType) {
            case AspectType.text: {
                this.setDimensions(230, 120);
                break;
            }
            case AspectType.boolean: {
                this.setDimensions(105, 72);
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
    transition = this.noAnimation;
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

    private dragging: boolean = false;
    private moving: boolean = false;

    constructor(renderer: Renderer2, private characterMakerService: CharacterMakerService) {
        this.characterMakerService.registerSubComponent(this);
        renderer.listen('document', 'mousemove', (event) => {
            if (this.dragging) {
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
            }
            if (this.moving) {
                console.log(this.characterMakerService.leftBoundary(this))
                let newTop = this.top + event.movementY;
                let newLeft = this.left + event.movementX;
                if (newTop >= 0) {
                    this.top = newTop;
                }
                if (newLeft >= this.characterMakerService.leftBoundary(this)) {
                    this.left = newLeft;
                }
            }
        });

        renderer.listen('document', 'mouseup', () => {
            this.dragging = false;
            this.moving = false;
        });
    }

    setDimensions(width: number, height: number) {
        this.width = width;
        this.minWidth = width;
        this.height = height;
        this.minHeight = height;
    }

    startDrag(): void {
        this.dragging = true;
    }

    startMove(): void {
        this.moving = true;
    }

    remove(): void {
        this.characterMakerService.removeComponent(this.aspect);
    }

    animate(x: number, y: number): void {
        this.transition = this.animation;
        this.transform = 'translate(' + x + 'px, ' + y + 'px)';
        Observable.timer(2000).subscribe(() => this.stopAnimation());
    }

    stopAnimation(): void {
        this.transition = this.noAnimation;
        this.transform = '';
    }

    private getMaxWidth(): number {
        return window.innerWidth - 100;
    }
}
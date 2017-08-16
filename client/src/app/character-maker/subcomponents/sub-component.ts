import { Aspect, AspectType } from '../aspect';
import { AfterViewInit, Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SubComponentChild } from './sub-component-child';
import { CharacterMakerService } from '../character-maker.service';

@Component({
    selector: 'sub-component',
    templateUrl: 'sub-component.html',
    styleUrls: ['sub-component.css']
})
export class SubComponent implements OnInit, AfterViewInit {
    ngAfterViewInit(): void {
        console.log('this.child');
        console.log(this.child);
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
    top: number = 0;
    left: number = 0;
    minHeight: number;
    minWidth: number;
    value: any;

    private dragging: boolean = false;
    private moving: boolean = false;

    constructor(renderer: Renderer2, private characterMakerService: CharacterMakerService) {
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
                console.log('trying to move ' + this.top + ' ' + this.left);
                this.top += event.movementY;
                this.left += event.movementX;
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
        console.log('start move')
        this.moving = true;
    }

    remove(): void {
        this.characterMakerService.removeComponent(this.aspect);
    }

    private getMaxWidth(): number {
        return window.innerWidth - 100;
    }
}
import { Aspect, AspectType } from '../aspect';
import {
    AfterViewInit, Component, Input, OnInit,
    ViewChild
} from '@angular/core';
import { SubComponentChild } from './sub-component-child';
import { CharacterMakerService } from '../../maker/character-maker.service';
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

    // @HostListener('mouseenter')
    // hover(): void {
    //     console.log('mouseenter')
    //     this.zIndex = 1;
    //     this.isHovered = true;
    //     this.aspect.config.isHovered = true;
    // }
    //
    // @HostListener('mouseleave')
    // stopHover(): void {
    //     console.log('mouseleave')
    //     if (!this.optionsOpen) {
    //         this.zIndex = 0;
    //         this.isHovered = false;
    //     }
    //     this.aspect.config.isHovered = false;
    // }

    private resizing: boolean = false;
    private moving: boolean = false;

    constructor(private characterMakerService: CharacterMakerService) {

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
        // if (width >= this.minWidth &&
        //     this.aspect.left + width <= this.getMaxWidth()) {
        //     this.aspect.width = width;
        // }
        // if (height >= this.minHeight) {
        //     this.aspect.height = height;
        // }
        // this.child.resize(width, height);
    }

    setDimensions(width: number, height: number) {
        // this.minWidth = width;
        // this.minHeight = height;
        // if (this.aspect.isNew) {
        //     this.aspect.width = width;
        //     this.aspect.height = height;
        // }
    }

    getValue(): any {
        return this.child.getValue();
    }

    remove(): void {
        this.characterMakerService.removeComponent(this.aspect);
    }

    openOptions(): void {
        this.optionsOpen = true;
    }

    closeOptions(): void {
        this.optionsOpen = false;
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
}
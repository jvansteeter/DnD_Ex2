import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { SubComponentService } from '../sub-component.service';
import { SubComponentChild } from '../sub-component-child';
import { MdMenu } from '@angular/material';


@Component({
    selector:  'characterMaker-textComponent',
    templateUrl: 'text.component.html',
    styleUrls: ['../sub-component.css']
})
export class TextComponent implements SubComponentChild, AfterViewInit{
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    @ViewChild('options') options: MdMenu;
    @ViewChild('fontSizeInput') fontSizeInput: ElementRef;
    label: string;
    required: boolean;
    width: number = 158;
    height: number = 40;
    hasOptions = true;
    value: any;

    readonly widthMargin = 34;
    readonly heightMargin = 10;

    fontSize: number = 14;

    constructor(private renderer: Renderer2, subComponentService: SubComponentService) {

    }

    ngAfterViewInit(): void {
        this.renderer.listen(this.fontSizeInput.nativeElement, 'change', () => {
            this.parent.resize(this.width + this.widthMargin, this.height + this.heightMargin + this.fontSize - 14);
        });
    }

    public resize(width: number, height: number): void {
        this.width = width - this.widthMargin;
        this.height = height - this.heightMargin;
    }

    getMenuOptions(): MdMenu {
        return this.options;
    }

    closeOptions(): void {
        this.parent.closeOptions();
    }

    stopClickPropagate(event): void {
        event.stopPropagation();
    }

    closeMenu(): void {
        this.options._emitCloseEvent();
    }

    // changeFontSize(event): void {
    //     console.log(event)
    //     let newFontSize = event.target.value;
    //     console.log(newFontSize)
    //     this.resize(this.width, this.height + (newFontSize - this.fontSize))
    //     this.fontSize = newFontSize;
    // }
}

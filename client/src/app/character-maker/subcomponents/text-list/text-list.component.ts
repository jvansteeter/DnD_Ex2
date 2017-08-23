import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { MdMenu } from '@angular/material';
import { SubComponent } from '../sub-component';


interface TextItem {
    value: string
}

@Component({
    selector: 'characterMaker-textListComponent',
    templateUrl: 'text-list.component.html',
    styleUrls: ['../sub-component.css']
})
export class TextListComponent implements SubComponentChild, AfterViewInit {
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    @ViewChild('options') options: MdMenu;
    label: string;
    required: boolean;
    width: number;
    height: number;
    readonly hasOptions = true;
    value: any;

    private items: TextItem[];
    fontSize: number = 14;
    @ViewChild('fontSizeInput') fontSizeInput: ElementRef;

    constructor(private renderer: Renderer2) {
        this.items = [];
    }

    ngAfterViewInit(): void {
        this.width = this.parent.width;
        this.height = this.parent.height;

        this.renderer.listen(this.fontSizeInput.nativeElement, 'change', () => {
            this.parent.resize(this.width, this.height + this.fontSize - 14);
        });
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getMenuOptions(): MdMenu {
        return this.options;
    }

    closeOptions(): void {
        this.parent.closeOptions();
    }

    addItem(): void {
        this.items.push({value: ''});
        this.parent.resize(this.width, this.height + 34);
        this.parent.minHeight = this.height;
    }

    stopClickPropagate(event): void {
        event.stopPropagation();
    }

    closeMenu(): void {
        this.options._emitCloseEvent();
    }
}


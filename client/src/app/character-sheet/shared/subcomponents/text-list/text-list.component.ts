import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { MatMenu } from '@angular/material';


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
    @ViewChild('options') options: MatMenu;
    label: string;
    required: boolean;
    width: number;
    height: number;
    readonly hasOptions = true;
    value: any;

    private items: TextItem[];
    private readonly itemHeight = 34;
    fontSize: number = 14;
    @ViewChild('fontSizeInput') fontSizeInput: ElementRef;

    constructor(private renderer: Renderer2) {
        this.items = [];
    }

    ngAfterViewInit(): void {
        // this.width = this.parent.aspect.width;
        // this.height = this.parent.aspect.height;

        this.renderer.listen(this.fontSizeInput.nativeElement, 'change', () => {
            this.parent.minHeight += this.fontSize - 14;
            // this.parent.resize(this.width, this.height + this.fontSize - 14);
        });
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getMenuOptions(): MatMenu {
        return this.options;
    }

    closeOptions(): void {
        this.parent.closeOptions();
    }

    addItem(): void {
        this.items.push({value: ''});
        // this.parent.resize(this.width, this.height + this.itemHeight);
        this.parent.minHeight += this.itemHeight;
    }

    removeItem(): void {
        this.items.splice(this.items.length - 1, 1);
        this.parent.minHeight -= this.itemHeight;
        // this.parent.resize(this.width, this.parent.aspect.height - this.itemHeight);
    }

    stopClickPropagate(event): void {
        event.stopPropagation();
    }

    closeMenu(): void {
        // this.options._emitCloseEvent();
    }

    getValue() {
        return this.value;
    }
}


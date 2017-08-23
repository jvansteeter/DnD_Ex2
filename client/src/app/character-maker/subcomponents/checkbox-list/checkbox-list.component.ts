import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { MdMenu } from '@angular/material';
import { SubComponent } from '../sub-component';


interface checkboxItem {
    label: string;
    value: boolean;
}

@Component({
    selector: 'characterMaker-checkBoxListComponent',
    templateUrl: 'checkbox-list.component.html',
    styleUrls: ['../sub-component.css']
})
export class CheckboxListComponent implements SubComponentChild, AfterViewInit {
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    @ViewChild('options') options: MdMenu;
    label: string;
    required: boolean;
    width: number;
    height: number;
    readonly hasOptions = true;
    value: any;

    private checkboxes: checkboxItem[];
    fontSize: number = 14;
    @ViewChild('fontSizeInput') fontSizeInput: ElementRef;

    constructor(private renderer: Renderer2) {
        this.checkboxes = [];
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

    addCheckbox(): void {
        this.checkboxes.push({
            label: '',
            value: false
        });
        this.parent.resize(this.width, this.height + 25);
        this.parent.minHeight = this.height;
    }

    stopClickPropagate(event): void {
        event.stopPropagation();
    }

    closeMenu(): void {
        this.options._emitCloseEvent();
    }
}


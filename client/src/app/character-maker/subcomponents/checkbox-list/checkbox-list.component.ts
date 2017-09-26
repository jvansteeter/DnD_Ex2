import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { MdMenu } from '@angular/material';
import { SubComponent } from '../sub-component';
import { CharacterMakerService } from '../../character-maker.service';


interface CheckboxItem {
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

    private checkboxes: CheckboxItem[];
    private readonly checkboxHeight = 25;
    fontSize: number = 14;
    @ViewChild('fontSizeInput') private fontSizeInput: ElementRef;

    constructor(private renderer: Renderer2, private characterMakerService: CharacterMakerService) {
        this.checkboxes = [];
    }

    ngAfterViewInit(): void {
        this.width = this.parent.width;
        this.height = this.parent.height;

        this.renderer.listen(this.fontSizeInput.nativeElement, 'change', () => {
            this.parent.resize(this.width, this.height + this.fontSize - 10);
            this.parent.minHeight += this.fontSize - 14;
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
        this.parent.resize(this.width, this.height + this.checkboxHeight);
        this.parent.minHeight += this.checkboxHeight;
    }

    removeCheckbox(): void {
        this.checkboxes.splice(this.checkboxes.length - 1, 1);
        this.parent.minHeight -= this.checkboxHeight;
        this.parent.resize(this.width, this.parent.minHeight);
    }

    stopClickPropagate(event): void {
        event.stopPropagation();
    }

    closeMenu(): void {
        this.options._emitCloseEvent();
    }

    valueChanged(): void {
        this.characterMakerService.updateFunctionAspects();
    }

    getValue(): any {
        return this.checkboxes;
    }
}


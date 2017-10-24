import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { MatMenu } from '@angular/material';
import { CharacterInterfaceFactory } from '../../character-interface.factory';
import { CharacterInterfaceService } from '../../character-interface.service';


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
    @ViewChild('options') options: MatMenu;
    label: string;
    required: boolean;
    width: number;
    height: number;
    readonly hasOptions = true;
    value: any;

    private characterMakerService: CharacterInterfaceService;

    private checkboxes: CheckboxItem[];
    private readonly checkboxHeight = 25;
    fontSize: number = 14;
    @ViewChild('fontSizeInput') private fontSizeInput: ElementRef;

    constructor(private renderer: Renderer2, private characterInterfaceFactory: CharacterInterfaceFactory) {
        this.characterMakerService = this.characterInterfaceFactory.getCharacterInterface();
        this.checkboxes = [];
    }

    ngAfterViewInit(): void {
        this.width = this.parent.aspect.width;
        this.height = this.parent.aspect.height;

        this.renderer.listen(this.fontSizeInput.nativeElement, 'change', () => {
            this.parent.resize(this.width, this.height + this.fontSize - 10);
            this.parent.minHeight += this.fontSize - 14;
        });

        console.log('this is my aspect')
        console.log(this.aspect)
        if (this.aspect.hasOwnProperty('items') && this.aspect.items.length > 0) {
            for (let i = 0; i < this.aspect.items.length; i++) {
                this.checkboxes.push({
                    label: this.aspect.items[i],
                    value: false
                });
                // this.parent.resize(this.width, this.height + this.checkboxHeight);
                this.parent.minHeight += this.checkboxHeight;
            }
        }
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
        // this.options._emitCloseEvent();
    }

    valueChanged(): void {
        this.characterMakerService.updateFunctionAspects();
    }

    getValue(): any {
        return this.checkboxes;
    }

    getCheckboxLabels(): string[] {
        let labels: string[] = [];
        for (let i = 0; i < this.checkboxes.length; i++) {
            labels.push(this.checkboxes[i].label);
        }

        return labels;
    }
}

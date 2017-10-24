import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { SubComponentChild } from '../sub-component-child';
import { MatMenu } from '@angular/material';
import { CharacterInterfaceService } from '../../character-interface.service';
import { CharacterInterfaceFactory } from '../../character-interface.factory';


@Component({
    selector:  'characterMaker-numberComponent',
    templateUrl: 'number.component.html',
    styleUrls: ['../sub-component.css']
})
export class NumberComponent implements SubComponentChild, AfterViewInit{
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    @ViewChild('options') options: MatMenu;
    @ViewChild('fontSizeInput') fontSizeInput: ElementRef;
    label: string;
    required: boolean;
    width: number = 52;
    height: number = 20;
    hasOptions = true;
    value: any;

    readonly widthMargin = 34;
    readonly heightMargin = 10;

    fontSize: number = 14;

    private characterService: CharacterInterfaceService;

    constructor(private renderer: Renderer2, characterInterfaceFactory: CharacterInterfaceFactory) {
        this.characterService = characterInterfaceFactory.getCharacterInterface();
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

    getMenuOptions(): MatMenu {
        return this.options;
    }

    closeOptions(): void {
        this.parent.closeOptions();
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

    changeFontSize(event): void {
        let newFontSize = event.target.value;
        this.resize(this.width, this.height + (newFontSize - this.fontSize));
        this.fontSize = newFontSize;
    }

    valueChanged(): void {
        this.characterService.updateFunctionAspects();
    }
}

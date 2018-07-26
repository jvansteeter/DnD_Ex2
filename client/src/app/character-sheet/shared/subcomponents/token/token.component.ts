import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../../../types/character-sheet/aspect';
import { SubComponentChild } from '../sub-component-child';
import { MatMenu } from '@angular/material';


@Component({
    selector:  'characterMaker-tokenComponent',
    templateUrl: 'token.component.html',
    styleUrls: ['../sub-component.scss']
})
export class TokenComponent implements SubComponentChild, AfterViewInit{
    @Input() aspect: Aspect;
    @ViewChild('options') options: MatMenu;
    label: string;
    required: boolean;
    readonly hasOptions = false;
    value: string = '';

    @ViewChild('fileInput') fileInput: ElementRef;
    reader: FileReader = new FileReader();

    constructor() {

    }

    ngAfterViewInit(): void {
    }

    getMenuOptions(): MatMenu {
        return this.options;
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

    setValue(value: any): any {
        this.value = value;
    }

    upload(): void {
        this.fileInput.nativeElement.click();
    }

    loadImage(): void {
        this.reader.addEventListener('load', () => {
            this.value = this.reader.result;
        });
        if (this.fileInput.nativeElement.files[0]) {
            this.reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
        }
    }
}

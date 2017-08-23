import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { SubComponentService } from '../sub-component.service';
import { SubComponentChild } from '../sub-component-child';
import { MdMenu } from '@angular/material';


interface CategoryOption {
    value: string
}

@Component({
    selector:  'characterMaker-categoryComponent',
    templateUrl: 'category.component.html',
    styleUrls: ['../sub-component.css']
})
export class CategoryComponent implements SubComponentChild, AfterViewInit{
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    @ViewChild('options') options: MdMenu;
    label: string;
    required: boolean;
    width: number = 158;
    height: number = 40;
    hasOptions = true;
    value: any;

    private categoryInput: string = '';
    private categoryToRemove: CategoryOption;

    private categories: CategoryOption[];

    constructor() {
        this.categories = [];
    }

    ngAfterViewInit(): void {
    }

    public resize(width: number, height: number): void {
    }

    addCategory(): void {
        if (this.categoryInput !== '') {
            this.categories.push({
                value: this.categoryInput
            });
            this.categoryInput = '';
            this.closeOptions();
        }
    }

    removeCategory(): void {
        if (this.categoryToRemove) {
            this.categories.splice(this.categories.indexOf(this.categoryToRemove), 1);
        }
        this.closeOptions();
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
}

import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Aspect } from '../../aspect';
import { SubComponent } from '../sub-component';
import { SubComponentChild } from '../sub-component-child';
import { CharacterMakerService } from '../../../maker/character-maker.service';
import { MatMenu } from '@angular/material';


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
    @ViewChild('options') options: MatMenu;
    label: string;
    required: boolean;
    hasOptions = true;
    value: any;

    private categoryInput: string = '';
    private categoryToRemove: CategoryOption;

    private categories: CategoryOption[];

    constructor(private characterMakerService: CharacterMakerService) {
        this.categories = [];
    }

    ngAfterViewInit(): void {
        if (this.aspect.hasOwnProperty('items') && this.aspect.items.length > 0) {
            for (let i = 0; i < this.aspect.items.length; i++) {
                this.categories.push({
                    value: this.aspect.items[i].value
                });
            }
        }
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

    getCategories(): any[] {
        return this.categories;
    }

    valueChanged(): void {
        this.characterMakerService.updateFunctionAspects();
    }
}

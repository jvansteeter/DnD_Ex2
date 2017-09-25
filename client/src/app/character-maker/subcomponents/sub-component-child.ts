import { Aspect } from '../aspect';
import { MdMenu } from '@angular/material';
import { SubComponent } from './sub-component';

export interface SubComponentChild {
    aspect: Aspect;
    parent: SubComponent;
    width: number;
    height: number;
    readonly hasOptions: boolean;

    resize(width: number, height: number);
    getMenuOptions(): MdMenu;
    closeOptions(): void;
    getValue(): any;
}
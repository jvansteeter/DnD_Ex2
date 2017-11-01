import { Aspect } from '../aspect';
import { SubComponent } from './sub-component';
import { MatMenu } from '@angular/material';

export interface SubComponentChild {
    aspect: Aspect;
    parent: SubComponent;
    readonly hasOptions: boolean;

    getMenuOptions(): MatMenu;
    closeOptions(): void;
    getValue(): any;
}
import { Aspect } from '../../../types/character-sheet/aspect';
import { SubComponent } from './sub-component';
import { MatMenu } from '@angular/material';

export interface SubComponentChild {
    aspect: Aspect;
    readonly hasOptions: boolean;

    getMenuOptions(): MatMenu;
    getValue(): any;
    setValue(value: any): void;
}
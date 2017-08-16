import { Component, Input } from '@angular/core';
import { SubComponentChild } from '../sub-component-child';
import { Aspect } from '../../aspect';


@Component({
    selector: 'characterMaker-checkBoxComponent',
    templateUrl: 'checkbox.component.html',
    styleUrls: ['../sub-component.css']
})
export class CheckboxComponent implements SubComponentChild {
    @Input() aspect: Aspect;
    label: string;
    required: boolean;
    width: number;
    height: number;
    value: any;

    resize(width: number, height: number) {
        // does nothing
    }
}

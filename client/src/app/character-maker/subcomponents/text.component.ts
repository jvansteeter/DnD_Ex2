import { Component, Input } from '@angular/core';
import { subComponent } from './sub-component';
import { Aspect } from '../aspect';


@Component({
    selector:  'characterMaker-textComponent',
    templateUrl: 'text.component.html',
    styleUrls: ['sub-component.css']
})
export class TextComponent extends subComponent {
    @Input() aspect: Aspect;
    value: any;

    constructor() {
        super(230, 130);
    }
}

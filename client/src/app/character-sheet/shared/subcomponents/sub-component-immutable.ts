import { Component, Input } from '@angular/core';
import { Aspect, AspectType } from '../aspect';


@Component({
    selector: 'sub-component-immutable',
    templateUrl: 'sub-component-immutable.html',
    styleUrls: ['sub-component.css']
})
export class SubComponentImmutable {
    @Input() aspect: Aspect;

    aspectType = AspectType;

    constructor() {

    }
}

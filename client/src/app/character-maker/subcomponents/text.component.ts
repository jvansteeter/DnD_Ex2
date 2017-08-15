import {AfterViewInit, Component, ContentChild, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import { subComponent } from './sub-component';
import { Aspect } from '../aspect';


@Component({
    selector:  'characterMaker-textComponent',
    templateUrl: 'text.component.html',
    styleUrls: ['../character-maker.component.css']
})
export class TextComponent extends subComponent {
    @Input() aspect: Aspect;
    // width = 500;
    // height = 500;
    value: any;

    constructor() {
        super();
        console.log('text component constructor')
    }
}

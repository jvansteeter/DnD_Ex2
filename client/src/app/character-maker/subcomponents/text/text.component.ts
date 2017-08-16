import { Component, Input } from '@angular/core';
import { Aspect } from "../../aspect";
import { SubComponent } from "../sub-component";
import { SubComponentService } from "../sub-component.service";
import { SubComponentChild } from '../sub-component-child';


@Component({
    selector:  'characterMaker-textComponent',
    templateUrl: 'text.component.html',
    styleUrls: ['../sub-component.css']
})
export class TextComponent implements SubComponentChild{
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    label: string;
    required: boolean;
    width: number;
    height: number;
    value: any;

    constructor(subComponentService: SubComponentService) {
    }

    public resize(width: number, height: number): void {
        this.width = width - 72;
        this.height = height - 80;
    }
}

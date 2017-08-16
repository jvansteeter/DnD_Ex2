import { Component, Input } from '@angular/core';
import { Aspect } from "../aspect";
import { SubComponent } from "./sub-component";
import { SubComponentEvent, SubComponentService } from "./sub-component.service";


@Component({
    selector:  'characterMaker-textComponent',
    templateUrl: 'text.component.html',
    styleUrls: ['sub-component.css']
})
export class TextComponent {
    @Input() aspect: Aspect;
    @Input() parent: SubComponent;
    label: string;
    required: boolean;
    width: number;
    height: number;
    value: any;

    constructor(subComponentService: SubComponentService) {
        subComponentService.subscribe((event: SubComponentEvent) => {
            switch (event.type) {
                case 'resize': {
                    this.width = event.data['width'] - 72;
                    this.height = event.data['height'] - 80;
                }
            }
        });
    }
}

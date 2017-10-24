import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Aspect, AspectType } from '../aspect';
import { SubComponentChild } from './sub-component-child';
import { CharacterSheetService } from '../../sheet/character-sheet.service';


@Component({
    selector: 'sub-component-immutable',
    templateUrl: 'sub-component-immutable.html',
    styleUrls: ['sub-component.css']
})
export class SubComponentImmutable implements AfterViewInit {
    @Input() aspect: Aspect;
    @ViewChild('child') child: SubComponentChild;

    aspectType = AspectType;

    constructor(private characterSheetService: CharacterSheetService) {
    }

    ngAfterViewInit(): void {
        this.characterSheetService.registerSubComponent(this);
    }

    getValue(): any {
        return this.child.getValue();
    }

    closeOptions(): void {
        // do nothing
    }
}

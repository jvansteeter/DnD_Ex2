import { Aspect, AspectType } from '../aspect';
import {
    AfterViewInit, Component, Input,
    ViewChild
} from '@angular/core';
import { SubComponentChild } from './sub-component-child';
import { CharacterMakerService } from '../../maker/character-maker.service';
import { MatMenu } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'sub-component',
    templateUrl: 'sub-component.html',
    styleUrls: ['sub-component.css']
})
export class SubComponent implements AfterViewInit {
    @Input() aspect: Aspect;
    @ViewChild('child') child: SubComponentChild;
    options: MatMenu;
    aspectType = AspectType;
    optionsOpen: boolean = false;

    constructor(private characterMakerService: CharacterMakerService) {

    }

    ngAfterViewInit(): void {
        this.options = this.child.getMenuOptions();
        Observable.timer(100).subscribe(() => this.characterMakerService.registerSubComponent(this));
    }

    getValue(): any {
        return this.child.getValue();
    }

    closeOptions(): void {
        this.optionsOpen = false;
    }
}
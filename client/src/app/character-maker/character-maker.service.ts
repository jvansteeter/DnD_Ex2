import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Aspect } from './aspect';
import { SubComponent } from './subcomponents/sub-component';


@Injectable()
export class CharacterMakerService {
    private addEvents = new Subject();
    private removeEvents = new Subject();
    private resizeEvents = new Subject();

    private characterSheetWidth: number = 0;
    private subComponents: SubComponent[];

    public aspects: Aspect[];

    constructor() {
        this.aspects = [];
        this.subComponents = [];
    }

    public onAddComponent(next?, error?, complete?): Subscription {
        return this.addEvents.subscribe(next, error, complete);
    }

    public addComponent(aspect: any): void {
        this.addEvents.next(aspect);
    }

    public onRemoveComponent(next?, error?, complete?): Subscription {
        return this.removeEvents.subscribe(next, error, complete);
    }

    public removeComponent(aspect: any): void {
        this.removeEvents.next(aspect);
    }

    public getWidth(): number {
        return this.characterSheetWidth;
    }

    public setWidth(width: number): void {
        this.characterSheetWidth = width;
        this.resizeEvents.next(width);
    }

    public registerSubComponent(subComponent: SubComponent): void {
        this.subComponents.push(subComponent);
    }

    public onResize(next?, error?, complete?): Subscription {
        return this.resizeEvents.subscribe(next, error, complete);
    }

    public leftBoundary(subComponent: SubComponent): number {
        let index = this.subComponents.indexOf(subComponent);
        let offset = 0;
        for (let i = 0; i < index; i++) {
            offset += this.subComponents[i].width + 10;
        }

        return - (offset % this.characterSheetWidth);
    }
}
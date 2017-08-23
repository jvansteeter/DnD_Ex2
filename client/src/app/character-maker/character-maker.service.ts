import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Aspect } from './aspect';
import { SubComponent } from './subcomponents/sub-component';
import { Observable } from 'rxjs/Observable';


export enum Move {
    LEFT, RIGHT, UP, DOWN
}

@Injectable()
export class CharacterMakerService {
    private addEvents = new Subject();
    private removeEvents = new Subject();
    private resizeEvents = new Subject();
    private changeHeightEvents = new Subject();

    private characterSheetWidth: number = 0;
    private characterSheetHeight: number = 0;
    public subComponents: SubComponent[];
    private theRelocated: SubComponent[];

    public aspects: Aspect[];

    constructor() {
        this.aspects = [];
        this.subComponents = [];
        this.theRelocated = [];
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
        let index = this.aspects.indexOf(aspect);
        this.aspects.splice(index, 1);
        this.subComponents.splice(index, 1);
        this.adjustCharacterSheetHeight();
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
        let leftOffset = 0;
        for (let i = 0; i < this.subComponents.length; i++) {
            let stationary = this.subComponents[i];
            if (stationary.violatesRightTerritory(subComponent)) {
                let offset = stationary.left + stationary.width + 10;
                if (offset > leftOffset) {
                    leftOffset = offset;
                }
            }
        }
        this.subComponents.push(subComponent);
        Observable.timer(100).subscribe(() => {
            subComponent.animate(leftOffset, 0);
        });

        this.adjustCharacterSheetHeight();
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

    public reorderAnimation(moving: SubComponent, directions: Move[]): void {
        this.adjustCharacterSheetHeight();
        for (let i = 0; i < this.subComponents.length; i++) {
            let stationary = this.subComponents[i];
            if (stationary === moving) {
                continue;
            }
            if (moving.overlapsRightSide(stationary) && this.arrayContains(directions, Move.LEFT)) {
                stationary.animate(moving.width + 10, 0);
            }
            if (moving.overlapsLeftSide(stationary) && this.arrayContains(directions, Move.RIGHT)) {
                stationary.animate(-(moving.width + 10), 0);
            }
            // if (moving.overlapsTopSide(stationary) && this.arrayContains(directions, Move.DOWN)) {
            //     stationary.animate(0, -(moving.height + 10));
            // }
            // if (moving.overlapsRightSide(stationary) && this.arrayContains(directions, Move.UP)) {
            //     stationary.animate(0, moving.width + 10);
            // }
        }
    }

    public adjustCharacterSheetHeight(): void {
        let greatestHeight = 0;
        for (let i = 0; i < this.subComponents.length; i++) {
            let subComponent = this.subComponents[i];
            if (subComponent.height + subComponent.top > greatestHeight) {
                greatestHeight = subComponent.getTotalHeight() + subComponent.top;
            }
        }
        this.characterSheetHeight = greatestHeight;
        this.changeHeightEvents.next(greatestHeight);
    }

    public onChangeHeight(next?, error?, complete?): Subscription {
        return this.changeHeightEvents.subscribe(next, error, complete);
    }

    private arrayContains(array: any[], item: any) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return true;
            }
        }
        return false;
    }
}
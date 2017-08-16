import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class CharacterMakerService {
    private addEvents = new Subject();
    private removeEvents = new Subject();

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
}
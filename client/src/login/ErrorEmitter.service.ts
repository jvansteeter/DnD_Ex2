import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class ErrorEmitterService {
    private events = new Subject();

    public subscribe(next?, error?, complete?): Subscription {
        return this.events.subscribe(next, error, complete);
    }

    public emit(message: string): void {
        this.events.next(message);
    }
}

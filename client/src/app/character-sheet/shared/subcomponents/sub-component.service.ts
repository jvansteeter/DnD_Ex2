import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

export interface SubComponentEvent {
    type: string;
    data: any;
}

@Injectable()
export class SubComponentService {
    private events = new Subject();

    public subscribe(next?, error?): Subscription {
        return this.events.subscribe(next, error);
    }

    public emit(event: string, data: any): void {
        this.events.next({type: event, data: data});
    }
}

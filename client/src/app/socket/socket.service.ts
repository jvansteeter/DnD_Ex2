import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

declare const io: any;

@Injectable()
export class SocketService {
    private socket;

    constructor() {
        this.socket = io.connect();
    }

    on(eventName: string, data: any): Observable<any> {
        let subject = new Subject<any>();
        this.socket.on(eventName, (data) => {
            console.log(data)

        });

        return subject.asObservable();
    }
}
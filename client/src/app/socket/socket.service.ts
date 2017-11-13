import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { SocketApiLoader } from './socketApiLoader';

declare const io: any;

@Injectable()
export class SocketService {
    private socketLoadedPromise;
    private socket;

    constructor() {
        this.socketLoadedPromise = new Promise((resolve, reject) => {
            new SocketApiLoader().load().then(() => {
                this.socket = io.connect();
                resolve();
            }).catch(error => reject(error));
        });
    }

    on(eventName: string): Subject<any> {
        let subject = new Subject<any>();
        this.socketLoadedPromise.then(() => {
            this.socket.on(eventName, (data) => {
                subject.next(data);
            });
        });

        return subject;
    }

    emit(eventName: string, data: any): void {
        this.socketLoadedPromise.then(() => {
            this.socket.emit(eventName, data);
        });
    }
}
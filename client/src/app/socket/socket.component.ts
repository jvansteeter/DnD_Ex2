import { OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export abstract class SocketComponent implements OnDestroy {
    private socketFunctions: Subscription[];

    constructor(private socketService: SocketService) {
        this.socketFunctions = [];
    }

    ngOnDestroy(): void {
        this.socketFunctions.forEach(socketFunction => socketFunction.unsubscribe());
    }

    protected socketOn(eventName: string): Observable<any> {
        let subject = new Subject();
        this.socketFunctions.push(this.socketService.on(eventName).subscribe((data) => {
            subject.next(data);
        }));

        return subject.asObservable();
    }

    protected socketEmit(eventName: string, data: any): void {
        this.socketService.emit(eventName, data);
    }
}
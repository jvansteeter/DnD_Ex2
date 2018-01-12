import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export abstract class IsReadyService {
    private isReadySubject: BehaviorSubject<boolean>;

    constructor() {
        this.isReadySubject = new BehaviorSubject<boolean>(false);
    }

    public abstract init(): void;

    public isReady(): Observable<boolean> {
        return this.isReadySubject.asObservable();
    }

    protected setReady(ready: boolean): void {
        this.isReadySubject.next(ready);
    }
}
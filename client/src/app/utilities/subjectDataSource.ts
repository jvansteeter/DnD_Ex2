import { DataSource } from '@angular/cdk/collections';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


export class SubjectDataSource<T> extends DataSource<T> {
    private dataSubject: Subject<T[]>;

    constructor(subject: Subject<T[]>) {
        super();
        this.dataSubject = subject;
    }

    connect(): Observable<T[]> {
        return this.dataSubject.asObservable();
    }

    disconnect(): void {
    }
}
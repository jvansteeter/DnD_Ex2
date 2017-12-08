import { DataSource } from '@angular/cdk/collections';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


export class SubjectDataSource extends DataSource<Object> {
    private dataSubject: Subject<Object[]>;

    constructor(subject: Subject<Object[]>) {
        super();
        this.dataSubject = subject;
    }

    connect(): Observable<Object[]> {
        return this.dataSubject.asObservable();
    }

    disconnect(): void {
    }
}
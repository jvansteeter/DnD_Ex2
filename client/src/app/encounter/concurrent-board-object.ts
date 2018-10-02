import { Observable, Subject } from 'rxjs';

export class ConcurrentBoardObject {
	private changeEvent: Subject<any> = new Subject<any>();

	public emitChange(data?: any): void {
		this.changeEvent.next(data);
	}

	get changeObservable(): Observable<any> {
		return this.changeEvent.asObservable();
	}
}

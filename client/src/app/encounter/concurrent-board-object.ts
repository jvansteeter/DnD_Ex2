import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

export class ConcurrentBoardObject {
	private changeEvent: EventEmitter<void> = new EventEmitter<void>(true);

	public emitChange(data?: any): void {
		this.changeEvent.emit(data);
	}

	get changeObservable(): Observable<void> {
		return this.changeEvent.asObservable();
	}
}

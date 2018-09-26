import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

export class ConcurrentBoardObject {
	private changeEvent: EventEmitter<void> = new EventEmitter<void>(true);

	public emitChange(): void {
		this.changeEvent.emit();
	}

	get changeObservable(): Observable<void> {
		return this.changeEvent.asObservable();
	}
}

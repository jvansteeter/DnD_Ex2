import { ConcurrentBoardObject } from '../../../encounter/concurrent-board-object';
import { NotationData } from '../../../../../../shared/types/encounter/board/notation.data';
import { BoardNotationGroup } from './board-notation-group';
import { Subscription } from 'rxjs';

export class NotationState extends ConcurrentBoardObject {
	private _notations: BoardNotationGroup[] = [];
	private changeSubscriptions: Subscription[] = [];

	constructor() {
		super();
	}

	public add(note: BoardNotationGroup): void {
		this.changeSubscriptions.push(note.changeObservable.subscribe((data) => this.emitChange(data)));
		this._notations.push(note);
	}

	public remove(notationId: string): void {
		for (let i = 0; i < this._notations.length; i++) {
			const notation = this._notations[i];
			if (notation._id === notationId) {
				if (notation.isVisible) {
					this.emitChange();
				}
				this.changeSubscriptions.splice(i, 1);
				this._notations.splice(i, 1);
				return;
			}
		}
	}

	public get(notationId: string): BoardNotationGroup {
		for (const notation of this._notations) {
			if (notation._id === notationId) {
				return notation;
			}
		}

		return undefined;
	}

	public setNotations(notations: NotationData[]): void {
		for (let sub of this.changeSubscriptions) {
			sub.unsubscribe();
		}
		this.changeSubscriptions = [];
		this._notations = [];
		for (let notation of notations) {
			const boardNotation = new BoardNotationGroup(notation);
			this.add(boardNotation);
		}
	}

	get notations(): BoardNotationGroup[] {
		return this._notations;
	}
}

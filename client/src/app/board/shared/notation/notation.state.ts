import { ConcurrentBoardObject } from '../../../encounter/concurrent-board-object';
import { NotationData } from '../../../../../../shared/types/encounter/board/notation.data';
import { BoardNotationGroup } from './board-notation-group';

export class NotationState extends ConcurrentBoardObject {
	private readonly _notations: BoardNotationGroup[];

	constructor(notations: NotationData[] = []) {
		super();
		this._notations = [];
		for (let notation of notations) {
			this._notations.push(new BoardNotationGroup(notation));
		}
	}

	public add(note: BoardNotationGroup): void {
		this._notations.push(note);
		if (note.isVisible) {
			this.emitChange();
		}
	}

	public remove(notationId: string): void {
		for (let i = 0; i < this._notations.length; i++) {
			const notation = this._notations[i];
			if (notation._id === notationId) {
				if (notation.isVisible) {
					this.emitChange();
				}
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

	get notations(): BoardNotationGroup[] {
		return this._notations;
	}
}

import { Injectable } from '@angular/core';
import { IsReadyService } from '../utilities/services/isReady.service';
import { EncounterRepository } from '../repositories/encounter.repository';
import { XyPair } from '../board/geometry/xy-pair';
import { Player } from './player';
import { EncounterStateData } from '../../../../shared/types/encounter/encounterState';

@Injectable()
export class EncounterService extends IsReadyService {
	private encounterId: string;
	public encounterState: EncounterStateData;

	constructor(private encounterRepo: EncounterRepository) {
		super();
	}

	public init(): void {
		this.encounterRepo.getEncounter(this.encounterId).subscribe((encounter: EncounterStateData) => {
			this.encounterState = encounter;
			this.setReady(true);
		});
	}

	public setEncounterId(id: string): void {
		this.encounterId = id;
		this.setReady(false);
		this.init();
	}

	checkForPops(loc_cell: XyPair, pop_origin: XyPair) {

	}

	handleClick(loc_cell: XyPair) {

	}

	deselectAllPlayers() {

	}

	get players(): Player[] {
		if (this.encounterState) {
			return this.encounterState.players as Player[];
		}
		return [];
	}
}
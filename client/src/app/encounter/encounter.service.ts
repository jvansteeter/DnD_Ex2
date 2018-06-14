import { Injectable } from '@angular/core';
import { IsReadyService } from '../utilities/services/isReady.service';
import { EncounterRepository } from '../repositories/encounter.repository';
import { XyPair } from '../board/geometry/xy-pair';
import { Player } from './player';
import {Observable} from "rxjs/Observable";
import {PlayerData} from "../../../../shared/types/encounter/player";
import { EncounterState } from './encounter.state';
import { EncounterStateData } from '../../../../shared/types/encounter/encounterState';

@Injectable()
export class EncounterService extends IsReadyService {
	private encounterId: string;
	public encounterState: EncounterState;

	constructor(private encounterRepo: EncounterRepository) {
		super();
	}

	public init(): void {
		this.encounterRepo.getEncounter(this.encounterId).subscribe((encounter: EncounterStateData) => {
			this.encounterState = encounter as EncounterState;
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

	public addPlayer(playerData: PlayerData): Observable<void> {
		return this.encounterRepo.addPlayer(this.encounterState._id, playerData);
	}

	get players(): Player[] {
		if (this.encounterState) {
			return this.encounterState.players as Player[];
		}
		return [];
	}

	set players(value) {
		if (this.encounterState) {
			this.encounterState.players = value;
		}
	}
}
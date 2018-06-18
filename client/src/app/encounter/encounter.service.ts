import { Injectable } from '@angular/core';
import { IsReadyService } from '../utilities/services/isReady.service';
import { EncounterRepository } from '../repositories/encounter.repository';
import { XyPair } from '../board/geometry/xy-pair';
import { Player } from './player';
import { Observable } from "rxjs/Observable";
import { PlayerData } from "../../../../shared/types/encounter/player";
import { EncounterState } from './encounter.state';
import { EncounterStateData } from '../../../../shared/types/encounter/encounterState';
import { PopService } from '../board/pop/pop.service';
import { BoardStateService } from '../board/services/board-state.service';
import { BoardTraverseService } from '../board/services/board-traverse.service';
import { map, mergeMap, tap } from 'rxjs/operators';

@Injectable()
export class EncounterService extends IsReadyService {
	protected claimedPlayerId: string;
	protected hasClaimedPlayer = false;

	private encounterId: string;
	public encounterState: EncounterState;

	private playerSelected = false;

	constructor(
			private boardStateService: BoardStateService,
			private popService: PopService,
			private boardTraverseService: BoardTraverseService,
			private encounterRepo: EncounterRepository
	) {
		super();
	}

	public init(): void {
		this.encounterRepo.getEncounter(this.encounterId).subscribe((encounter: EncounterStateData) => {
			this.encounterState = new EncounterState(encounter);
			this.setReady(true);
		});
	}

	public setEncounterId(id: string): void {
		this.encounterId = id;
		this.setReady(false);
		this.init();
	}

	checkForPops(loc_cell: XyPair, pop_origin: XyPair) {
		if (this.boardStateService.do_pops) {
			for (const player of this.players) {
				if (player.location.x === loc_cell.x && player.location.y === loc_cell.y) {
					if (this.popService.popIsActive(player._id)) {
						this.popService.clearPlayerPop(player._id);
					} else {
						const x = (loc_cell.x + 1) * this.boardStateService.cell_res;
						const y = (loc_cell.y) * this.boardStateService.cell_res;
						this.popService.addPlayerPop(pop_origin.x, pop_origin.y, player);
					}
				}
			}
		}
	}

	handleClick(loc_cell: XyPair) {
		if (this.playerSelected) {
			for (const player of this.players) {
				if (player.location.x === loc_cell.x && player.location.y === loc_cell.y) {
					this.deselectAllPlayers();
					return;
				}
			}

			for (const player of this.players) {
				if (player.isSelected) {
					player.location = loc_cell;
					this.deselectAllPlayers();
				}
			}
		} else {
			for (const player of this.players) {
				if (player.location.x === loc_cell.x && player.location.y === loc_cell.y) {

					player.traversableCells_near = this.boardTraverseService.calcTraversableCells(player.location, player.speed);
					player.traversableCells_far = this.boardTraverseService.calcTraversableCells(player.location, player.speed * 2);

					player.isSelected = true;
					this.playerSelected = true;
				}
			}
		}
	}

	deselectAllPlayers() {
		for (const player of this.players) {
			player.isSelected = false;
		}
		this.playerSelected = false;
	}

	public addPlayer(playerData: PlayerData): Observable<void> {
		let getEncounterObservable = this.encounterRepo.getEncounter(this.encounterId)
				.pipe(
						tap((encounterState: EncounterStateData) => {
							this.encounterState = new EncounterState(encounterState);
						}),
						map(() => {
							return;
						})
				);
		return this.encounterRepo.addPlayer(this.encounterState._id, playerData)
				.pipe(
						mergeMap(() => {
							return getEncounterObservable;
						})
				);
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
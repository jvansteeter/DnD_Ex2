import {Injectable} from '@angular/core';
import {IsReadyService} from '../utilities/services/isReady.service';
import {EncounterRepository} from '../repositories/encounter.repository';
import {Player} from './player';
import {Observable} from "rxjs";
import {PlayerData} from "../../../../shared/types/encounter/player";
import {EncounterState} from './encounter.state';
import {EncounterStateData} from '../../../../shared/types/encounter/encounterState';
import {BoardStateService} from '../board/services/board-state.service';
import {map, mergeMap, tap} from 'rxjs/operators';

@Injectable()
export class EncounterService extends IsReadyService {
    protected claimedPlayerId: string;
    protected hasClaimedPlayer = false;

    private encounterId: string;
    public encounterState: EncounterState;

    constructor(
        protected boardStateService: BoardStateService,
        protected encounterRepo: EncounterRepository,
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

    public init_players() {

    };

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

    public getPlayerById(id: string): Player {
        for (const player of this.players) {
            if (player.id === id){
                return player;
            }
        }
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
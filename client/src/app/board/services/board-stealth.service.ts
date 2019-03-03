import { Injectable } from '@angular/core';
import { IsReadyService } from '../../utilities/services/isReady.service';
import { Player } from '../../encounter/player';
import { RuleModuleAspects } from '../../../../../shared/predefined-aspects.enum';
import { BoardTeamsService } from './board-teams.service';
import { BoardLightService } from "./board-light.service";
import { PlayerVisibilityMode } from "../../../../../shared/types/encounter/board/player-visibility-mode";
import { RightsService } from "../../data-services/rights.service";

@Injectable()
export class BoardStealthService extends IsReadyService {
	private teamPlayers: Player[] = [];

	constructor(private teamsService: BoardTeamsService,
	            private lightService: BoardLightService,
	            private rightsService: RightsService,
	            ) {
		super(teamsService, lightService, rightsService);
	}

	public init(): void {
		this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
			if (isReady && !this.isReady()) {
				this.teamPlayers = this.teamsService.getAllPlayersOnMyTeams();
				this.teamsService.teamsChangedObservable.subscribe(() => {
					this.teamPlayers = this.teamsService.getAllPlayersOnMyTeams();
				});
				this.setReady(true);
			}
		});
	}

	public unInit(): void {
		super.unInit();
		if (this.dependenciesSub) {
			this.dependenciesSub.unsubscribe();
		}
	}

	public  userCanSeeHiddenPlayer(hiddenPlayer: Player): boolean {
		const hidden: boolean = hiddenPlayer.characterData.values[RuleModuleAspects.HIDDEN] === 'true';
		if (!hidden) {
			return true;
		}
		const stealthScore: number = Number(hiddenPlayer.characterData.values[RuleModuleAspects.STEALTH]);
		for (let teamPlayer of this.teamPlayers) {
			if (this.lightService.playerVisibilityMode === PlayerVisibilityMode.TEAM || this.lightService.playerVisibilityMode === PlayerVisibilityMode.GLOBAL) {
				const playerPerception: number = Number(teamPlayer.characterData.values[RuleModuleAspects.PERCEPTION]);
				if (playerPerception >= stealthScore) {
					return true;
				}
			}
			else if (this.lightService.playerVisibilityMode === PlayerVisibilityMode.PLAYER) {
				if (this.rightsService.isMyPlayer(teamPlayer)) {
					const playerPerception: number = Number(teamPlayer.characterData.values[RuleModuleAspects.PERCEPTION]);
					if (playerPerception >= stealthScore) {
						return true;
					}
				}
			}
		}

		return false;
	}
}
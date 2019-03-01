import { Injectable } from '@angular/core';
import { IsReadyService } from '../../utilities/services/isReady.service';
import { Player } from '../../encounter/player';
import { RuleModuleAspects } from '../../../../../shared/predefined-aspects.enum';
import { BoardTeamsService } from './board-teams.service';

@Injectable()
export class BoardStealthService extends IsReadyService {
	private teamPlayers: Player[] = [];

	constructor(private teamsService: BoardTeamsService) {
		super(teamsService);
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

	public userCanSeeHiddenPlayer(player: Player): boolean {
		const hidden: boolean = player.characterData.values[RuleModuleAspects.HIDDEN] === 'true';
		if (!hidden) {
			return true;
		}
		const stealthScore: number = Number(player.characterData.values[RuleModuleAspects.STEALTH]);
		for (let teamPlayer of this.teamPlayers) {
			const playerPerception: number = Number(teamPlayer.characterData.values[RuleModuleAspects.PERCEPTION]);
			if (playerPerception >= stealthScore) {
				return true;
			}
		}

		return false;
	}
}
import {Injectable} from "@angular/core";
import {EncounterService} from "../../encounter/encounter.service";
import {UserProfileService} from "../../data-services/userProfile.service";
import {Player} from "../../encounter/player";
import {isUndefined} from "util";
import {IsReadyService} from "../../utilities/services/isReady.service";

@Injectable()
export class BoardTeamsService extends IsReadyService {
    constructor(
        private encounterService: EncounterService,
        private userProfileService: UserProfileService,
    ) {
        super(encounterService, userProfileService);
        this.init();
    }

    public init(): void {
        console.log('boardTeamsService.init()');
        this.dependenciesSub = this.dependenciesReady().subscribe((isReady: boolean) => {
            if (isReady && !this.isReady()) {
                console.log('\t\tboardTeamsService.init() -> isReady');
                this.setReady(true);
            }
        })
    }

    public unInit(): void {
        console.log('boardTeamsService.unInit()');
        super.unInit();
    }

    public userSharesTeamWithPlayer(player: Player): boolean {
        console.log('player: %o', player);
        let userTeams;
        for (let user of this.encounterService.encounterState.teamsData.users) {
            if (user.userId === this.userProfileService.userId) {
                userTeams = user.teams;
            }
        }
        console.log('userTeams: %o', userTeams);

        if (isUndefined(userTeams)) {
            return false;
        }

        let playerTeams = player.teams;
        for (let userTeam of userTeams) {
            for (let playerTeam of playerTeams) {
                if (userTeam === playerTeam) {
                    return true;
                }
            }
        }

        return false;
    }


}
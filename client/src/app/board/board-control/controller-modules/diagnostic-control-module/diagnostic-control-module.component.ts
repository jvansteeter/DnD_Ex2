import {Component} from "@angular/core";
import {BoardStateService} from "../../../services/board-state.service";
import {XyPair} from "../../../../../../../shared/types/encounter/board/xy-pair";
import {BoardVisibilityService} from "../../../services/board-visibility.service";
import {EncounterService} from "../../../../encounter/encounter.service";

@Component({
    selector: 'diagnostic-module',
    templateUrl: 'diagnostic-control-module.component.html',
    styleUrls: ['diagnostic-control-module.component.scss']
})

export class DiagnosticControlModuleComponent {
    constructor (
        private boardStateService: BoardStateService,
        private encounterService: EncounterService,
        private boardVisibilityService: BoardVisibilityService
    ){}

    public diag_raytraceInputChange(event) {
        if (this.encounterService.players.length > 0){
            const playerLoc = this.encounterService.players[0].location;
            const cell_res = BoardStateService.cell_res;
            const playerRes = new XyPair(playerLoc.x * cell_res + cell_res / 2, playerLoc.y * cell_res + cell_res / 2);
            this.boardVisibilityService.raytraceVisibilityFromCell(playerRes, this.boardStateService.diag_visibility_ray_count);
        }
    }
}
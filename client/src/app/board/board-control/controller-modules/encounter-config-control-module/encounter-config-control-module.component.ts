import {Component} from "@angular/core";
import {BoardStateService} from "../../../services/board-state.service";
import {ViewMode} from "../../../shared/enum/view-mode";

@Component({
    selector: 'encounter-config-module',
    templateUrl: 'encounter-config-control-module.component.html',
    styleUrls: ['encounter-config-control-module.component.scss']
})

export class EncounterConfigControlModuleComponent {
    public ViewMode = ViewMode;

    constructor(
        private boardStateService: BoardStateService,
    ) {}

    public mapOpacitySliderInput(event) {
        this.boardStateService.board_maker_map_opacity = event.value;
    }
}
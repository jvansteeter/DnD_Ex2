import {Component, OnInit} from "@angular/core";
import {BoardStateService} from "../../../services/board-state.service";
import {ViewMode} from "../../../shared/enum/view-mode";
import {EncounterService} from "../../../../encounter/encounter.service";
import {isDefined} from "@angular/compiler/src/util";
import { BoardCanvasService } from '../../../services/board-canvas.service';

@Component({
    selector: 'encounter-config-module',
    templateUrl: 'encounter-config-control-module.component.html',
    styleUrls: ['encounter-config-control-module.component.scss']
})

export class EncounterConfigControlModuleComponent implements OnInit {
    public ViewMode = ViewMode;

    constructor(
        private boardStateService: BoardStateService,
        private encounterService: EncounterService,
        private boardCanvasService: BoardCanvasService,
    ) {}

    ngOnInit(): void {
    }

    public mapOpacitySliderInput(event) {
        this.boardStateService.board_maker_map_opacity = event.value;
    }

	public gridOpacitySliderInput(value) {
			this.boardCanvasService.rebuild_grid_canvas = true;
			this.boardStateService.gridOpacity = value;
	}

    public mapEnabledControlsIsEnabled() {
        if (isDefined(this.encounterService.mapUrl)) {
            return true;
        }
        return false;
    }
}
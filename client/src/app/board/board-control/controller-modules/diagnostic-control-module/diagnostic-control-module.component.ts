import {Component} from "@angular/core";
import {BoardStateService} from "../../../services/board-state.service";

@Component({
    selector: 'diagnostic-module',
    templateUrl: 'diagnostic-control-module.component.html',
    styleUrls: ['diagnostic-control-module.component.scss']
})

export class DiagnosticControlModuleComponent {
    constructor (
        private boardStateService: BoardStateService,
    ){
    }
}
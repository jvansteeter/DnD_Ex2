import {Component, ComponentRef} from "@angular/core";
import {Player} from "../../../encounter/player";
import {PopService} from "../pop.service";
import {BoardStateService} from '../../services/board-state.service';

@Component({
    selector: 'npc-pop',
    templateUrl: 'npc-pop.component.html',
    styleUrls: ['npc-pop.component.css']
})

export class NpcPopComponent {
    parentRef: PopService;

    pos_x: number;
    pos_y: number;
    player: Player;

    window = false;
    actionsVisible = false;

    constructor(
        private boardStateService: BoardStateService
    ){}

    public initVars(parentRef: PopService, window: boolean, pos_x: number, pos_y: number, player: Player) {
        this.parentRef = parentRef;

        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.player = player;

        this.window = window;
    }

    toggleActionVis() {
        this.actionsVisible = !this.actionsVisible;
    }

    close() {
        this.parentRef.clearPlayerPop(this.player.id);
    }

    mouseDown(event) {
        switch (event.which) {
            case 1:
                this.boardStateService.mouseLeftDown = true;
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    mouseUp(event) {
        switch (event.which) {
            case 1:
                this.boardStateService.mouseLeftDown = false;
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    mouseMove(event) {
        if (this.boardStateService.mouseLeftDown) {
            this.pos_x = this.pos_x + event.movementX;
            this.pos_y = this.pos_y + event.movementY;
        }
    }
}

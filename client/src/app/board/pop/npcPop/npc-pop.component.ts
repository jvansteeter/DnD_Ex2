import {Component, ComponentRef} from "@angular/core";
import {Player} from "../../../encounter/player";
import {PopService} from "../pop.service";

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

    constructor(){}

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
        this.parentRef.clearPop(this.player.id);
    }
}

import {Component} from "@angular/core";

@Component({
    selector: 'npc-pop',
    templateUrl: 'npc-pop.component.html',
    styleUrls: ['npc-pop.component.css']
})

export class NpcPopComponent {
    pos_x: number;
    pos_y: number;
    data: any;

    actionsVisible = false;

    constructor(){}

    public initVars(pos_x: number, pos_y: number, data: any) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.data = data;
    }

    toggleActionVis() {
        this.actionsVisible = !this.actionsVisible;
    }
}

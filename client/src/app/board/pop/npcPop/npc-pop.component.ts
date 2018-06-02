import {Component} from "@angular/core";

@Component({
    selector: 'npc-pop',
    templateUrl: 'npc-pop.component.html'
})

export class NpcPopComponent {
    pos_x: number;
    pos_y: number;
    data: any;

    constructor(){}

    public initVars(pos_x: number, pos_y: number, data: any) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.data = data;
    }
}

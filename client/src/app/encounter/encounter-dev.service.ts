import {Injectable, OnInit} from "@angular/core";

@Injectable()
export class EncounterDevService implements OnInit {
    players = [];

    constructor() {}

    ngOnInit(): void {
        this.players = [
            {
                name: 'Joe',
                hp: 10,
                maxHp: 15,
                ac: 17,
                loc_x: 6,
                loc_y: 8
            },
            {
                name: 'Mary',
                hp: 7,
                maxHp: 9,
                ac: 12,
                loc_x: 4,
                loc_y: 7
            },
            {
                name: 'Sue',
                hp: 22,
                maxHp: 25,
                ac: 18,
                loc_x: 7,
                loc_y: 9
            }];
    }

}
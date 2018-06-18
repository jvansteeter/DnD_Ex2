import {XyPair} from "../board/geometry/xy-pair";
import { isUndefined } from 'util';

export class Player {
    _id: string;
    name: string;
    hp: number;
    maxHp: number;
    ac: number;
    speed: number;
    location: XyPair;
    tokenUrl: string;
    token_img: HTMLImageElement;
    actions: {action: string, detail: string}[];
    isSelected = false;

    traversableCells_near: Array<XyPair>;
    traversableCells_far: Array<XyPair>;

    constructor(name: string, hp: number, maxHp: number, ac: number, x?: number, y?: number, token_url?: string) {
    	  console.log('in player constructor')
        this.name = name;
        this.hp = hp;
        this.maxHp = maxHp;
        this.ac = ac;
        this.speed = 6;
        if (!isUndefined(x) && !isUndefined(y)) {
            this.location = new XyPair(x, y);
        }
        else {
        	this.location = new XyPair(0, 0);
        }
        if (!!token_url) {
            this.tokenUrl = token_url;
            this.token_img = new Image();
            this.token_img.src = this.tokenUrl;
        }
        this.actions = [];
    }

    addAction(action: string, detail: string) {
        this.actions.push({action, detail});
    }
}

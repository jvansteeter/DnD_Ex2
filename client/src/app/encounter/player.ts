import {XyPair} from "../board/geometry/xy-pair";

export class Player {
    id: number;
    name: string;
    hp: number;
    maxHp: number;
    ac: number;
    speed: number;
    loc: XyPair;
    token_url: string;
    token_img: HTMLImageElement;
    actions: {action: string, detail: string}[];
    isSelected = false;

    constructor(name: string, hp: number, mapHp: number, ac: number, x?: number, y?: number, token_url?: string) {
        this.name = name;
        this.hp = hp;
        this.maxHp = mapHp;
        this.ac = ac;
        this.speed = 3;
        if (!!x && !!y) {
            this.loc = new XyPair(x, y);
        }
        if (!!token_url) {
            this.token_url = token_url;
            this.token_img = new Image();
            this.token_img.src = this.token_url;
        }
        this.actions = [];
        this.id = window.crypto.getRandomValues(new Uint32Array(1))[0];
    }

    addAction(action: string, detail: string) {
        this.actions.push({action, detail});
    }
}

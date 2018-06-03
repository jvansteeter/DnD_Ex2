import {XyPair} from "../board/geometry/xy-pair";

export class Player {
    name: string;
    hp: number;
    maxHp: number;
    ac: number;
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
        if (!!x && !!y) {
            this.loc = new XyPair(x, y);
        }
        if (!!token_url) {
            this.token_url = token_url;
            this.token_img = new Image();
            this.token_img.src = this.token_url;
        }
        this.actions = [];
    }

    addAction(action: string, detail: string) {
        this.actions.push({action, detail});
    }
}

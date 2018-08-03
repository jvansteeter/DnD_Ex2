import {XyPair} from "../geometry/xy-pair";
import {NotationVisibility} from "./enum/notation-visibility";
import {ColorStatics} from "../statics/color-statics";

export class BoardNotation {
    public id: string;
    public name = 'Notation';
    public iconTag = 'edit';

    public freeformElements: Array<Array<XyPair>>;
    public cellElements: Array<XyPair>;

    public isVisible = false;
    public isLocked = false;
    public visibilityState = NotationVisibility.FULL;

    private red = 255;
    private green = 0;
    private blue = 0;
    private alpha = 1.0;


    constructor() {
        this.id = window.crypto.getRandomValues(new Uint32Array(1))[0];
        this.freeformElements = [];
        this.cellElements = [];
    }

    public toggleVisible() {
        this.isVisible = !this.isVisible;
    }

    public toggleLocked() {
        this.isLocked = !this.isLocked;
    }

    public toggleVisibility() {
        switch (this.visibilityState) {
            case NotationVisibility.FULL:
                this.visibilityState = NotationVisibility.PARTIAL;
                break;
            case NotationVisibility.PARTIAL:
                this.visibilityState = NotationVisibility.OFF;
                break;
            case NotationVisibility.OFF:
                this.visibilityState = NotationVisibility.FULL;
                break;
        }
    }

    public getRgbCode(): string {
        return 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue + ')';
    }

    public getRgbaCode() {
        return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
    }

    public setRgba(r: number, g: number, b: number, a: number) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    }

    public setRgbaWithString(rgbaString: string) {
        const useThese = ColorStatics.parseRgbaString(rgbaString);
        this.red = useThese[0];
        this.green = useThese[1];
        this.blue = useThese[2];
        this.alpha = useThese[3];
    }

    public startNewFreeform() {
        this.freeformElements.push(new Array<XyPair>());
    }

    public appendToFreeform(point: XyPair) {
        this.freeformElements[this.freeformElements.length - 1].push(point);
    }

    public toggleCell(cell: XyPair) {
        let i = 0;
        for (let test_cell of this.cellElements) {
            if (test_cell.hash() === cell.hash()) {
                this.cellElements.splice(i, 1);
                return;
            }
        }
        this.cellElements.push(cell);
    }
}
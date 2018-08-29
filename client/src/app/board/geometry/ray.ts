import {XyPair} from "./xy-pair";
import {Line} from "./line";

export class Ray {
    public origin: XyPair;
    public direction_degrees: number;
    public lineData: Line;

    constructor(origin: XyPair, direction_degrees: number) {
        this.origin = origin;
        this.direction_degrees = direction_degrees;
        const target_x = Math.cos(direction_degrees * Math.PI / 180) + origin.x;
        const target_y = Math.sin(direction_degrees * Math.PI / 180) + origin.y;
        this.lineData = new Line(origin, new XyPair(target_x, target_y));
    }
}
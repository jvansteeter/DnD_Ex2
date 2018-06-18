import {XyPair} from '../geometry/xy-pair';

export class CellVisibilityState {
    location: XyPair;

    public topVisible: boolean;
    public rightVisible: boolean;
    public bottomVisible: boolean;
    public leftVisible: boolean;

    constructor(location: XyPair, topVisible = false, rightVisible = false, bottomVisible = false, leftVisible = false) {
        this.location = location;
        this.topVisible = topVisible;
        this.rightVisible = rightVisible;
        this.bottomVisible = bottomVisible;
        this.leftVisible = leftVisible;
    }
}

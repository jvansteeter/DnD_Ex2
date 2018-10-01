import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';

export class CellTileState {
  public coor: XyPair;

  public hasTop: boolean;
  public hasRight: boolean;
  public hasBottom: boolean;
  public hasLeft: boolean;

  public topUrl: string;
  public rightUrl: string;
  public bottomUrl: string;
  public leftUrl: string;

  constructor() {
    this.hasBottom = false;
    this.hasLeft = false;
    this.hasRight = false;
    this.hasTop = false;

    this.topUrl = '';
    this.rightUrl = '';
    this.bottomUrl = '';
    this.leftUrl = '';
  }
}

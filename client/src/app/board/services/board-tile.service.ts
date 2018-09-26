import {Injectable} from '@angular/core';
import {CellTileState} from '../shared/cell-tile-state';
import {BoardStateService} from './board-state.service';
import {XyPair} from '../../../../../shared/types/encounter/board/geometry/xy-pair';

@Injectable()
export class BoardTileService {

  public activeTileUrl = '';
  public tileData = [];

  constructor(
    private boardStateService: BoardStateService
  ) {
    this.tileData = [];
    for (let x = 0; x < this.boardStateService.mapDimX; x++) {
      this.tileData[x] = Array<CellTileState>();
      for (let y = 0; y < this.boardStateService.mapDimY; y++) {
        this.tileData[x][y] = new CellTileState();
      }
    }
  }

  public setTileData_All(cell: XyPair) {
    const tileState: CellTileState = this.tileData[cell.x][cell.y];

    tileState.hasTop = true;
    tileState.hasLeft = true;
    tileState.hasRight = true;
    tileState.hasBottom = true;

    tileState.topUrl = this.activeTileUrl;
    tileState.leftUrl = this.activeTileUrl;
    tileState.bottomUrl = this.activeTileUrl;
    tileState.rightUrl = this.activeTileUrl;
  }

  public setTileData_Top(cell: XyPair) {
    const tileState = this.tileData[cell.x][cell.y];
    tileState.hasTop = true;
    tileState.topUrl = this.activeTileUrl;
  }

  public setTileData_Bottom(cell: XyPair) {
    const tileState = this.tileData[cell.x][cell.y];
    tileState.hasBottom = true;
    tileState.bottomUrl = this.activeTileUrl;
  }

  public setTileData_Left(cell: XyPair) {
    const tileState = this.tileData[cell.x][cell.y];
    tileState.hasLeft = true;
    tileState.leftUrl = this.activeTileUrl;
  }

  public setTileData_Right(cell: XyPair) {
    const tileState = this.tileData[cell.x][cell.y];
    tileState.hasRight = true;
    tileState.rightUrl = this.activeTileUrl;
  }

}

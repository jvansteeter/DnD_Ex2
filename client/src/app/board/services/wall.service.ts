import {Injectable} from '@angular/core';
import {Wall} from '../map-objects/wall';
import {XyPair} from '../geometry/xy-pair';
import {CellTarget} from '../shared/cell-target';
import {CellZone} from '../shared/cell-zone';
import {BoardStateService} from './board-state.service';

@Injectable()
export class WallService {

  public wallData: Map<string, Wall> = new Map();
  private blockMap = [];

  constructor(
    private boardStateService: BoardStateService
  ) {
    this.blockMap = [];
    for (let x = 0; x < this.boardStateService.mapDimX * this.boardStateService.cell_res; x++) {
      this.blockMap[x] = [];
      for (let y = 0; y < this.boardStateService.mapDimY * this.boardStateService.cell_res; y++) {
        this.blockMap[x][y] = 0;
      }
    }
  }

  private BresenhamLine(x0: number, y0: number, x1: number, y1: number): XyPair[] {
    const result = Array<XyPair>();
    const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

    let dummy: number;
    if (steep) {
      dummy = x0;
      x0 = y0;
      y0 = dummy;

      dummy = x1;
      x1 = y1;
      y1 = dummy;
    }

    if (x0 > x1) {
      dummy = x0;
      x0 = x1;
      x1 = dummy;

      dummy = y0;
      y0 = y1;
      y1 = dummy;
    }

    const deltaX = x1 - x0;
    const deltaY = Math.abs(y1 - y0);
    let error = 0;
    let y_step;
    let y = y0;

    if (y0 < y1) {
      y_step = 1;
    } else {
      y_step = -1;
    }

    for (let x = x0; x <= x1; x++) {
      if (steep) {
        result.push(new XyPair(y, x));
      } else {
        result.push(new XyPair(x, y));
      }

      error += deltaY;
      if (2 * error >= deltaX) {
        y += y_step;
        error -= deltaX;
      }
    }

    return result;
  }

  public rayCast(origin: XyPair, target: XyPair): boolean {
    const points = this.BresenhamLine(origin.x, origin.y, target.x, target.y);
    for (const point of points) {
      if (this.blockMap[point.x][point.y] === 1) {
        return false;
      }
    }
    return true;
  }

  public addWall(loc: CellTarget) {
    if (!this.hasWall(loc)) {
      this.wallData.set(loc.hash(), new Wall(loc, this.boardStateService.cell_res));

      switch (loc.zone) {
        case CellZone.NORTH:
          this.setNorth(loc.coor);
          break;
        case CellZone.WEST:
          this.setWest(loc.coor);
          break;
        case CellZone.FWR:
          this.setFwd(loc.coor);
          break;
        case CellZone.BKW:
          this.setBkw(loc.coor);
          break;
      }
    }
  }

  public removeWall(loc: CellTarget): void {
    if (this.hasWall(loc)) {
      this.wallData.delete(loc.hash());
      // this.wallData.set(loc.hash(), new Wall(loc, this.boardStateService.cell_res));

      switch (loc.zone) {
        case CellZone.NORTH:
          this.unsetNorth(loc.coor);
          break;
        case CellZone.WEST:
          this.unsetWest(loc.coor);
          break;
        case CellZone.FWR:
          this.unsetFwd(loc.coor);
          break;
        case CellZone.BKW:
          this.unsetBkw(loc.coor);
          break;
      }
    }
  }

  public toggleWall(loc: CellTarget): void {
    if (this.hasWall(loc)) {
      this.removeWall(loc);
    } else {
      this.addWall(loc);
    }
  }

  public hasWall(loc: CellTarget): boolean {
    return this.wallData.has(loc.hash());
  }

  private northSet(cell: XyPair): Map<string, XyPair> {
    const returnMe = new Map<string, XyPair>();
    for (let y = cell.y * this.boardStateService.cell_res; y >= (cell.y * this.boardStateService.cell_res) - 1; y--) {
      for (let x = cell.x * this.boardStateService.cell_res; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res; x++) {
        const pair = new XyPair(x, y);
        returnMe.set(pair.hash(), pair);
      }
    }
    return returnMe;
  }

  private setNorth(cell: XyPair) {
    for (const point of Array.from(this.northSet(cell).values())) {
      this.blockMap[point.x][point.y] = 1;
    }
  }

  private unsetNorth(cell: XyPair) {
    let unsetPoints = this.northSet(cell);
    if (this.hasWall(new CellTarget(cell, CellZone.WEST))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.westSet(cell));
    }
    if (this.hasWall(new CellTarget(cell, CellZone.FWR))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.fwdSet(cell));
    }
    if (this.hasWall(new CellTarget(cell, CellZone.BKW))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.bkwSet(cell));
    }

    const topCell = new XyPair(cell.x, cell.y - 1);
    if (this.hasWall(new CellTarget(topCell, CellZone.WEST))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.westSet(topCell));
    }
    if (this.hasWall(new CellTarget(topCell, CellZone.FWR))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.fwdSet(topCell));
    }
    if (this.hasWall(new CellTarget(topCell, CellZone.BKW))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.bkwSet(topCell));
    }

    const rightCell = new XyPair(cell.x + 1, cell.y);
    if (this.hasWall(new CellTarget(rightCell, CellZone.WEST))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.westSet(rightCell));
    }

    const topRightCell = new XyPair(cell.x + 1, cell.y - 1);
    if (this.hasWall(new CellTarget(topRightCell, CellZone.WEST))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.westSet(topRightCell));
    }

    for (const point of Array.from(unsetPoints.values())) {
      this.blockMap[point.x][point.y] = 0;
    }
  }

  private westSet(cell: XyPair): Map<string, XyPair> {
    const returnMe = new Map<string, XyPair>();
    for (let x = cell.x * this.boardStateService.cell_res; x >= (cell.x * this.boardStateService.cell_res) - 1; x--) {
      for (let y = cell.y * this.boardStateService.cell_res; y < cell.y * this.boardStateService.cell_res + this.boardStateService.cell_res; y++) {
        const pair = new XyPair(x, y);
        returnMe.set(pair.hash(), pair);
      }
    }
    return returnMe;
  }

  private setWest(cell: XyPair) {
    for (const point of Array.from(this.westSet(cell).values())) {
      this.blockMap[point.x][point.y] = 1;
    }
  }

  private unsetWest(cell: XyPair) {
    let unsetPoints = this.westSet(cell);
    if (this.hasWall(new CellTarget(cell, CellZone.NORTH))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.northSet(cell));
    }
    if (this.hasWall(new CellTarget(cell, CellZone.FWR))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.fwdSet(cell));
    }
    if (this.hasWall(new CellTarget(cell, CellZone.BKW))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.bkwSet(cell));
    }

    const leftCell = new XyPair(cell.x - 1, cell.y);
    if (this.hasWall(new CellTarget(leftCell, CellZone.NORTH))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.northSet(leftCell));
    }
    if (this.hasWall(new CellTarget(leftCell, CellZone.FWR))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.fwdSet(leftCell));
    }
    if (this.hasWall(new CellTarget(leftCell, CellZone.BKW))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.bkwSet(leftCell));
    }

    const botCell = new XyPair(cell.x, cell.y + 1);
    if (this.hasWall(new CellTarget(botCell, CellZone.NORTH))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.northSet(botCell));
    }

    const botLeftCell = new XyPair(cell.x - 1, cell.y + 1);
    if (this.hasWall(new CellTarget(botLeftCell, CellZone.NORTH))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.northSet(botLeftCell));
    }

    for (const point of Array.from(unsetPoints.values())) {
      this.blockMap[point.x][point.y] = 0;
    }
  }

  private fwdSet(cell: XyPair): Map<string, XyPair> {
    const returnMe = new Map<string, XyPair>();
    let y = cell.y * this.boardStateService.cell_res + this.boardStateService.cell_res - 1;
    for (let x = cell.x * this.boardStateService.cell_res; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res; x++) {
      const pair = new XyPair(x, y);
      returnMe.set(pair.hash(), pair);
      y--;
    }
    y = cell.y * this.boardStateService.cell_res + this.boardStateService.cell_res - 2;
    for (let x = cell.x * this.boardStateService.cell_res; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res - 1; x++) {
      const pair = new XyPair(x, y);
      returnMe.set(pair.hash(), pair);
      y--;
    }
    y = cell.y * this.boardStateService.cell_res + this.boardStateService.cell_res - 1;
    for (let x = cell.x * this.boardStateService.cell_res + 1; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res; x++) {
      const pair = new XyPair(x, y);
      returnMe.set(pair.hash(), pair);
      y--;
    }
    return returnMe;
  }

  private setFwd(cell: XyPair) {
    for (const point of Array.from(this.fwdSet(cell).values())) {
      this.blockMap[point.x][point.y] = 1;
    }
  }

  private unsetFwd(cell: XyPair) {
    let unsetPoints = this.fwdSet(cell);
    if (this.hasWall(new CellTarget(cell, CellZone.WEST))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.westSet(cell));
    }
    if (this.hasWall(new CellTarget(cell, CellZone.NORTH))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.northSet(cell));
    }
    if (this.hasWall(new CellTarget(cell, CellZone.BKW))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.bkwSet(cell));
    }

    const botCell = new XyPair(cell.x, cell.y + 1);
    if (this.hasWall(new CellTarget(botCell, CellZone.NORTH))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.northSet(botCell));
    }

    const rightCell = new XyPair(cell.x + 1, cell.y);
    if (this.hasWall(new CellTarget(rightCell, CellZone.WEST))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.westSet(rightCell));
    }

    for (const point of Array.from(unsetPoints.values())) {
      this.blockMap[point.x][point.y] = 0;
    }
  }

  private bkwSet(cell: XyPair): Map<string, XyPair> {
    const returnMe = new Map<string, XyPair>();
    let y = cell.y * this.boardStateService.cell_res;
    for (let x = cell.x * this.boardStateService.cell_res; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res; x++) {
      const pair = new XyPair(x, y);
      returnMe.set(pair.hash(), pair);
      y++;
    }
    y = cell.y * this.boardStateService.cell_res;
    for (let x = cell.x * this.boardStateService.cell_res + 1; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res; x++) {
      const pair = new XyPair(x, y);
      returnMe.set(pair.hash(), pair);
      y++;
    }
    y = cell.y * this.boardStateService.cell_res + 1;
    for (let x = cell.x * this.boardStateService.cell_res; x < cell.x * this.boardStateService.cell_res + this.boardStateService.cell_res - 1; x++) {
      const pair = new XyPair(x, y);
      returnMe.set(pair.hash(), pair);
      y++;
    }
    return returnMe;
  }

  private setBkw(cell: XyPair) {
    for (const point of Array.from(this.bkwSet(cell).values())) {
      this.blockMap[point.x][point.y] = 1;
    }
  }

  private unsetBkw(cell: XyPair) {
    let unsetPoints = this.bkwSet(cell);
    if (this.hasWall(new CellTarget(cell, CellZone.WEST))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.westSet(cell));
    }
    if (this.hasWall(new CellTarget(cell, CellZone.FWR))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.fwdSet(cell));
    }
    if (this.hasWall(new CellTarget(cell, CellZone.NORTH))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.northSet(cell));
    }

    const botCell = new XyPair(cell.x, cell.y + 1);
    if (this.hasWall(new CellTarget(botCell, CellZone.NORTH))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.northSet(botCell));
    }

    const rightCell = new XyPair(cell.x + 1, cell.y);
    if (this.hasWall(new CellTarget(rightCell, CellZone.WEST))) {
      unsetPoints = this.setA_minus_setB(unsetPoints, this.westSet(rightCell));
    }

    for (const point of Array.from(unsetPoints.values())) {
      this.blockMap[point.x][point.y] = 0;
    }
  }

  // returns the contents of set_a minus overlap within set_b
  private setA_minus_setB(map_a: Map<string, XyPair>, map_b: Map<string, XyPair>): Map<string, XyPair> {
    const returnMe = new Map<string, XyPair>();
    for (const pair of Array.from(map_a.values())) {
      if (!map_b.has(pair.hash())) {
        returnMe.set(pair.hash(), pair);
      }
    }
    return returnMe;
  }

  public logBlockMapToConsole() {
    let consoleString = '';
    for (let y = 0; y < this.blockMap[0].length; y++) {
      for (let x = 0; x < this.blockMap.length; x++) {
        if (this.blockMap[x][y] === 0) {
          consoleString = consoleString + '\u25FB';
          // consoleString = consoleString + '\u25A1';
        } else {
          consoleString = consoleString + '\u25FC';
          // consoleString = consoleString + '\u25A0';
        }
      }
      consoleString = consoleString + '\n';
    }
    console.log(consoleString);
  }
}

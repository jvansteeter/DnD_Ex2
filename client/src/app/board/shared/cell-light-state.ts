import {LightValue} from './enum/light-value';
import {XyPair} from '../../../../../shared/types/encounter/board/xy-pair';

export class CellLightConfig {
  // The cell coordinate in board-map-grid notation
  coor: XyPair;

  light_north: LightValue;
  light_east: LightValue;
  light_south: LightValue;
  light_west: LightValue;

  constructor(x: number, y: number) {
    this.coor = new XyPair(x, y);

    this.light_north = LightValue.DARK;
    this.light_east = LightValue.DARK;
    this.light_south = LightValue.DARK;
    this.light_west = LightValue.DARK;
  }

  updateLightIntensityNorth(newIntensity: LightValue): void {
    if (this.light_north === LightValue.FULL) {
    }
    if (this.light_north === LightValue.DIM) {
      if (newIntensity === LightValue.FULL) {
        this.light_north = LightValue.FULL;
      }
    }
    if (this.light_north === LightValue.DARK) {
      if (newIntensity === LightValue.DIM) {
        this.light_north = LightValue.DIM;
      }
      if (newIntensity === LightValue.FULL) {
        this.light_north = LightValue.FULL;
      }
    }
  }

  updateLightIntensityEast(newIntensity: LightValue): void {
    if (this.light_east === LightValue.FULL) {
    }
    if (this.light_east === LightValue.DIM) {
      if (newIntensity === LightValue.FULL) {
        this.light_east = LightValue.FULL;
      }
    }
    if (this.light_east === LightValue.DARK) {
      if (newIntensity === LightValue.DIM) {
        this.light_east = LightValue.DIM;
      }
      if (newIntensity === LightValue.FULL) {
        this.light_east = LightValue.FULL;
      }
    }
  }

  updateLightIntensitySouth(newIntensity: LightValue): void {
    if (this.light_south === LightValue.FULL) {
    }
    if (this.light_south === LightValue.DIM) {
      if (newIntensity === LightValue.FULL) {
        this.light_south = LightValue.FULL;
      }
    }
    if (this.light_south === LightValue.DARK) {
      if (newIntensity === LightValue.DIM) {
        this.light_south = LightValue.DIM;
      }
      if (newIntensity === LightValue.FULL) {
        this.light_south = LightValue.FULL;
      }
    }
  }

  updateLightIntensityWest(newIntensity: LightValue): void {
    if (this.light_west === LightValue.FULL) {
    }
    if (this.light_west === LightValue.DIM) {
      if (newIntensity === LightValue.FULL) {
        this.light_west = LightValue.FULL;
      }
    }
    if (this.light_west === LightValue.DARK) {
      if (newIntensity === LightValue.DIM) {
        this.light_west = LightValue.DIM;
      }
      if (newIntensity === LightValue.FULL) {
        this.light_west = LightValue.FULL;
      }
    }
  }
}

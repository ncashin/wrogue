import "./style.css";
import { draw } from "./draw.ts";
import { provideECSInstanceFunctions } from "./ecs.ts";
import {
  floodFill,
  getTile,
  iterateAdjacentTiles,
  iterateTilemap as iterateGrid,
  tilemap,
} from "./tilemap.ts";

export const {
  ecsInstance,

  createEntity,
  destroyEntity,

  addComponent,
  removeComponent,

  getComponent,
  queryComponents,

  runSystem,
} = provideECSInstanceFunctions();

export const POSITION_COMPONENT_DEF: {
  type: "position";
  x: number;
  y: number;
} = {
  type: "position",
  x: 0,
  y: 0,
};
export const COLOR_COMPONENT_DEF: {
  type: "color";
  color: string;
} = {
  type: "color",
  color: "red",
};

iterateGrid((x, y, tile) => {
  if (
    x === 0 ||
    getTile(x + 1, y) === undefined ||
    y === 0 ||
    getTile(x, y + 1) === undefined
  ) {
    tile.obstructed = true;
    return;
  }

  tile.obstructed = Math.random() < 0.8;
});
const ITERATION_COUNT = 4;
for (let i = 0; i < ITERATION_COUNT; i++) {
  iterateGrid((x, y, tile) => {
    if (
      x === 0 ||
      getTile(x + 1, y) === undefined ||
      y === 0 ||
      getTile(x, y + 1) === undefined
    ) {
      return;
    }
    let obstructedCount = 0;
    iterateAdjacentTiles(x, y, (_x, _y, adjacentTile) => {
      if (adjacentTile !== undefined && adjacentTile.obstructed) {
        obstructedCount++;
      }
    });

    tile.obstructed = obstructedCount <= 3 || 7 <= obstructedCount;
  });
}
let unobstructedTileFound = false;
iterateGrid((x, y, tile) => {
  if (!unobstructedTileFound && !tile.obstructed) {
    floodFill(x, y, 0);
    unobstructedTileFound = true;
  }
});

iterateGrid((_x, _y, tile) => {
  tile.obstructed = tile.floodScore === undefined;
});

const animationFrame = () => {
  draw();
  window.requestAnimationFrame(animationFrame);
};
window.requestAnimationFrame(animationFrame);

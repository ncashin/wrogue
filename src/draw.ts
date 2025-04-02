import { COLOR_COMPONENT_DEF, POSITION_COMPONENT_DEF, runSystem } from "./main";
import { iterateTilemap, tilemap } from "./tilemap";

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

type RGB = [number, number, number];
export const interpolateColor = (color1: RGB, color2: RGB, factor: number) => {
  let r = Math.round(color1[0] + factor * (color2[0] - color1[0]));
  let g = Math.round(color1[1] + factor * (color2[1] - color1[1]));
  let b = Math.round(color1[2] + factor * (color2[2] - color1[2]));
  return `rgb(${r}, ${g}, ${b})`;
};

export const TILE_SIZE = 32;

document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = TILE_SIZE * tilemap.length;
  canvas.height = TILE_SIZE * tilemap[0].length;
  canvas.style.width = TILE_SIZE * tilemap.length + "px";
  canvas.style.height = TILE_SIZE * tilemap[0].length + "px";

  context = canvas.getContext("2d") as CanvasRenderingContext2D;
});

window.ENABLE_DEBUG_DRAW = true;
export const draw = () => {
  if (context == undefined) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (window.ENABLE_DEBUG_DRAW) {
    debugDraw();
  }
};

export const debugDraw = () => {
  context.fillStyle = "black";
  iterateTilemap((x, y, tile) => {
    if (!tile.obstructed) {
      return;
    }

    context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  });
  iterateTilemap((x, y, tile) => {
    if (tile.obstructed || tile.floodScore === undefined) {
      return;
    }

    const red = [255, 0, 0];
    const green = [0, 255, 0];
    const factor = (tile.floodScore - 1) / 25;
    context.fillStyle = interpolateColor(red, green, factor);

    context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    context.fillStyle = "black";
    context.fillText(
      tile.floodScore.toString(),
      x * TILE_SIZE + 3,
      y * TILE_SIZE + (TILE_SIZE - 3)
    );
  });
  runSystem(
    [POSITION_COMPONENT_DEF, COLOR_COMPONENT_DEF],
    (_entity, [position, color]) => {
      context.strokeStyle = color.color;
      context.fillRect(
        position.x * TILE_SIZE,
        position.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  );
};

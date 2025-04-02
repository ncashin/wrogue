type Tile = {
  obstructed: boolean;
  entity: number | undefined;
  floodScore: number | undefined;
};

export const MAP_SIZE = 20;
export let tilemap: Array<Array<Tile>> = Array.apply(
  undefined,
  Array(MAP_SIZE)
).map(() => Array.apply(undefined, Array(MAP_SIZE)).map(() => ({})));

export const getTile = (x: number, y: number) => {
  if (tilemap[x] === undefined) return undefined;
  return tilemap[x][y];
};

export const iterateAdjacentTiles = (
  x: number,
  y: number,
  lambda: (x: number, y: number, tile: Tile) => void
) => {
  for (let dx = -1; dx < 2; dx++) {
    for (let dy = -1; dy < 2; dy++) {
      const tile = getTile(x + dx, y + dy);
      if (tile === undefined) continue;
      lambda(x + dx, y + dy, tile);
    }
  }
};
export const iterateTilemap = (
  lambda: (x: number, y: number, tile: Tile) => void
) => {
  for (let x = 0; x < tilemap.length; x++) {
    for (let y = 0; y < tilemap[x].length; y++) {
      lambda(x, y, tilemap[x][y]);
    }
  }
};

export const floodFill = (x: number, y: number, initialScore: number) => {
  const initialTile = getTile(x, y);
  if (initialTile === undefined) return;
  initialTile.floodScore = initialScore;

  const adjacentScore = initialScore + 1;
  iterateAdjacentTiles(x, y, (adjacentX, adjacentY, adjacentTile) => {
    if (
      adjacentTile.obstructed ||
      (adjacentTile.floodScore !== undefined &&
        adjacentTile.floodScore <= adjacentScore)
    )
      return;
    floodFill(adjacentX, adjacentY, adjacentScore);
  });
};

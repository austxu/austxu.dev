import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { deflateSync } from "node:zlib";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const projectRoot = resolve(import.meta.dirname, "..");
const topologyPath = require.resolve("world-atlas/land-50m.json");

const WIDTH = 1024;
const HEIGHT = 488;
const SPACING_X = WIDTH / 183.5;
const SPACING_Y = HEIGHT / 87.57;
const RADIUS = 1.86;

const topology = JSON.parse(await readFile(topologyPath, "utf8"));
const landCollection = feature(topology, topology.objects.land);
const land = landCollection.features[0];
const landIndex = createPolygonIndex(land);

const dots = [];

for (let y = RADIUS; y <= HEIGHT - RADIUS; y += SPACING_Y) {
  for (let x = RADIUS; x <= WIDTH - RADIUS; x += SPACING_X) {
    const coordinate = inverseWebMercator([x, y]);

    if (landIndex.contains(coordinate)) {
      dots.push([round(x), round(y)]);
    }
  }
}

const metadata = {
  width: WIDTH,
  height: HEIGHT,
  spacing: {
    x: round(SPACING_X),
    y: round(SPACING_Y),
  },
  radius: RADIUS,
  projection: {
    name: "webMercator",
    centralMeridian: 0,
    normalizedToCanvas: true,
    maxLatitude: round(
      (Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI,
    ),
  },
  source: {
    dataset: "Natural Earth 1:50m land",
    package: "world-atlas@2.0.2",
  },
  dots,
};

const dataPath = resolve(projectRoot, "public/data/world-map-dots.json");
const maskPath = resolve(projectRoot, "public/world-map-dots.png");

await mkdir(dirname(dataPath), { recursive: true });
await writeFile(dataPath, `${JSON.stringify(metadata)}\n`);
await writeFile(maskPath, encodePng(renderAlphaMask(dots)));

console.log(
  `Generated ${dots.length} dots at ${WIDTH}x${HEIGHT}:` +
    `\n  ${dataPath}` +
    `\n  ${maskPath}`,
);

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function inverseWebMercator([x, y]) {
  const longitude = (x / WIDTH) * 360 - 180;
  const latitude =
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / HEIGHT))) * 180) /
    Math.PI;

  return [longitude, latitude];
}

function createPolygonIndex(landFeature) {
  const polygons =
    landFeature.geometry.type === "MultiPolygon"
      ? landFeature.geometry.coordinates
      : [landFeature.geometry.coordinates];
  const tileSize = 5;
  const buckets = new Map();

  for (const rings of polygons) {
    const outer = rings[0];
    const longitudes = outer.map(([longitude]) => longitude);
    const latitudes = outer.map(([, latitude]) => latitude);
    const bounds = {
      minLongitude: Math.min(...longitudes),
      maxLongitude: Math.max(...longitudes),
      minLatitude: Math.min(...latitudes),
      maxLatitude: Math.max(...latitudes),
    };
    const polygon = { bounds, rings };
    const minColumn = longitudeColumn(bounds.minLongitude, tileSize);
    const maxColumn = longitudeColumn(bounds.maxLongitude, tileSize);
    const minRow = latitudeRow(bounds.minLatitude, tileSize);
    const maxRow = latitudeRow(bounds.maxLatitude, tileSize);

    for (let row = minRow; row <= maxRow; row += 1) {
      for (let column = minColumn; column <= maxColumn; column += 1) {
        const key = `${column}:${row}`;
        const bucket = buckets.get(key);

        if (bucket) {
          bucket.push(polygon);
        } else {
          buckets.set(key, [polygon]);
        }
      }
    }
  }

  return {
    contains([longitude, latitude]) {
      const key = `${longitudeColumn(longitude, tileSize)}:${latitudeRow(
        latitude,
        tileSize,
      )}`;
      const candidates = buckets.get(key) ?? [];

      return candidates.some(({ bounds, rings }) => {
        if (
          longitude < bounds.minLongitude ||
          longitude > bounds.maxLongitude ||
          latitude < bounds.minLatitude ||
          latitude > bounds.maxLatitude ||
          !pointInRing(longitude, latitude, rings[0])
        ) {
          return false;
        }

        return !rings
          .slice(1)
          .some((ring) => pointInRing(longitude, latitude, ring));
      });
    },
  };
}

function longitudeColumn(longitude, tileSize) {
  return Math.floor((longitude + 180) / tileSize);
}

function latitudeRow(latitude, tileSize) {
  return Math.floor((latitude + 90) / tileSize);
}

function pointInRing(longitude, latitude, ring) {
  const unwrapped = [];
  let previousLongitude = normalizeLongitudeNear(
    ring[0][0],
    longitude,
  );

  for (const [rawLongitude, rawLatitude] of ring) {
    const currentLongitude = normalizeLongitudeNear(
      rawLongitude,
      previousLongitude,
    );
    unwrapped.push([currentLongitude, rawLatitude]);
    previousLongitude = currentLongitude;
  }

  const ringLongitudes = unwrapped.map(([ringLongitude]) => ringLongitude);
  const ringCenter =
    (Math.min(...ringLongitudes) + Math.max(...ringLongitudes)) / 2;
  const shiftedLongitude =
    longitude + Math.round((ringCenter - longitude) / 360) * 360;
  let inside = false;

  for (
    let current = 0, previous = unwrapped.length - 1;
    current < unwrapped.length;
    previous = current, current += 1
  ) {
    const [currentLongitude, currentLatitude] = unwrapped[current];
    const [previousLongitude, previousLatitude] = unwrapped[previous];
    const crossesLatitude =
      currentLatitude > latitude !== previousLatitude > latitude;

    if (!crossesLatitude) {
      continue;
    }

    const crossingLongitude =
      ((previousLongitude - currentLongitude) *
        (latitude - currentLatitude)) /
        (previousLatitude - currentLatitude) +
      currentLongitude;

    if (shiftedLongitude < crossingLongitude) {
      inside = !inside;
    }
  }

  return inside;
}

function normalizeLongitudeNear(longitude, reference) {
  return longitude + Math.round((reference - longitude) / 360) * 360;
}

function renderAlphaMask(points) {
  const pixels = Buffer.alloc(WIDTH * HEIGHT * 4);

  for (const [centerX, centerY] of points) {
    const minX = Math.max(0, Math.floor(centerX - RADIUS - 1));
    const maxX = Math.min(WIDTH - 1, Math.ceil(centerX + RADIUS + 1));
    const minY = Math.max(0, Math.floor(centerY - RADIUS - 1));
    const maxY = Math.min(HEIGHT - 1, Math.ceil(centerY + RADIUS + 1));

    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        const distance = Math.hypot(x + 0.5 - centerX, y + 0.5 - centerY);
        const coverage = Math.max(0, Math.min(1, RADIUS + 0.5 - distance));

        if (coverage === 0) {
          continue;
        }

        const index = (y * WIDTH + x) * 4;
        pixels[index] = 255;
        pixels[index + 1] = 255;
        pixels[index + 2] = 255;
        pixels[index + 3] = Math.max(
          pixels[index + 3],
          Math.round(coverage * 255),
        );
      }
    }
  }

  return pixels;
}

function encodePng(pixels) {
  const scanlines = Buffer.alloc((WIDTH * 4 + 1) * HEIGHT);

  for (let y = 0; y < HEIGHT; y += 1) {
    const destinationOffset = y * (WIDTH * 4 + 1);
    const sourceOffset = y * WIDTH * 4;
    scanlines[destinationOffset] = 0;
    pixels.copy(
      scanlines,
      destinationOffset + 1,
      sourceOffset,
      sourceOffset + WIDTH * 4,
    );
  }

  const signature = Buffer.from([
    137, 80, 78, 71, 13, 10, 26, 10,
  ]);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(WIDTH, 0);
  header.writeUInt32BE(HEIGHT, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    signature,
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(scanlines, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

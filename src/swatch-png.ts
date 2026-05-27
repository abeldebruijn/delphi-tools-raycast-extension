import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { deflateSync } from "node:zlib";

export type CreateTempSwatchPngOptions = {
  colour: string;
  namespace: string;
  width?: number;
  height?: number;
};

const DEFAULT_SWATCH_WIDTH = 180;
const DEFAULT_SWATCH_HEIGHT = 96;
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

export async function createTempSwatchPng({
  colour,
  namespace,
  width = DEFAULT_SWATCH_WIDTH,
  height = DEFAULT_SWATCH_HEIGHT,
}: CreateTempSwatchPngOptions): Promise<string> {
  const hex = normaliseHexColour(colour);
  const filePath = getTempSwatchPath({ hex, namespace, width, height });

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, encodeSolidColourPng({ hex, width, height }));

  return filePath;
}

export function normaliseHexColour(colour: string): string {
  const trimmed = colour.trim();
  const match = /^#?([0-9a-fA-F]{6})$/.exec(trimmed);

  if (!match) {
    throw new Error(`Expected a 6-digit hex colour, received: ${colour}`);
  }

  return `#${match[1].toLowerCase()}`;
}

function getTempSwatchPath({
  hex,
  namespace,
  width,
  height,
}: {
  hex: string;
  namespace: string;
  width: number;
  height: number;
}): string {
  const fileSafeNamespace = namespace.replace(/[^a-zA-Z0-9_-]/g, "-");

  return path.join(
    tmpdir(),
    "delphitools-raycast-extension",
    fileSafeNamespace,
    `swatch-${width}x${height}-${hex.slice(1)}.png`,
  );
}

function encodeSolidColourPng({
  hex,
  width,
  height,
}: {
  hex: string;
  width: number;
  height: number;
}): Buffer {
  const [red, green, blue] = hexToRgb(hex);
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);

  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * stride;

    raw[rowOffset] = 0;

    for (let x = 0; x < width; x += 1) {
      const offset = rowOffset + 1 + x * 4;

      raw[offset] = red;
      raw[offset + 1] = green;
      raw[offset + 2] = blue;
      raw[offset + 3] = 255;
    }
  }

  const ihdr = Buffer.alloc(13);

  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    PNG_SIGNATURE,
    createPngChunk("IHDR", ihdr),
    createPngChunk("IDAT", deflateSync(raw)),
    createPngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function createPngChunk(type: string, data: Buffer): Buffer {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);

  length.writeUInt32BE(data.length, 0);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function hexToRgb(colour: string): [number, number, number] {
  const hex = normaliseHexColour(colour).slice(1);

  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

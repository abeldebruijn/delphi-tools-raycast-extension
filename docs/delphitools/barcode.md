# barcode

Generate 1D and 2D barcodes.

## Inputs

- `DATA` required: data to encode.

## Options

- `--format <FORMAT>`: `ean13`, `ean8`, `upca`, `code39`, `code128`, `codabar`, `code93`, or `itf`; default `code128`.
- `--height <HEIGHT>`: bar height in pixels; default `120`.
- `--scale <SCALE>`: width scale in pixels per module; default `2`.
- `--text`: include human-readable text below the barcode.
- Global: `--json`, `--quiet`, `--output`.

## Output

Barcode image.

# impose

Impose a PDF for booklet, saddle-stitch, or n-up printing.

## Inputs

- `PDF` required: source PDF path.

## Options

- `--layout <LAYOUT>`: `saddle-stitch`, `perfect-bind`, or `n-up`; default `saddle-stitch`.
- `--paper <PAPER>`: output paper size; default `a4`.
- `--n-up <N_UP>`: pages per sheet for n-up; default `4`.
- `--signature <SIGNATURE>`: pages per signature for perfect-bind; default `16`.
- `--margins <MARGINS>`: margin in mm; default `10`.
- `--gutter <GUTTER>`: gutter in mm; default `5`.
- `--creep <CREEP>`: creep compensation in mm; default `0`.
- `--crop-marks`: draw crop marks.
- `--duplex`: add duplex back-sheet pages.
- Global: `--json`, `--quiet`, `--output`.

## Output

Imposed PDF.

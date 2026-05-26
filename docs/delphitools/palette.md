# palette

Generate colour palettes using 28 strategies across 6 categories.

## Inputs

No positional input. Use options to select strategy and output shape.

## Options

- `--strategy <STRATEGY>`: strategy name, such as `analogous`, `80s`, or `ocean-sunset`; omit to list strategies.
- `--size <SIZE>`: number of colours, default `5`.
- `--format <FORMAT>`: `hex`, `css`, `json`, or `png`; default `hex`.
- `--lock <LOCK>`: lock palette slots, e.g. `0:#ff6600,3:#003366`.
- `--seed <SEED>`: reproducible generation seed.
- `--pretty`, `-p`: prefix colours with slot indexes.
- `--list`: list available strategies.
- Global: `--json`, `--quiet`, `--output`.

## Output

A generated palette as text, CSS, JSON, or PNG.

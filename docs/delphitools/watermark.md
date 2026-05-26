# watermark

Composite a watermark onto images.

## Inputs

- `IMAGES` optional variadic: input image paths.
- `--mark <MARK>` required: watermark image path.

## Options

- `--position <POSITION>`: `top-left`, `top`, `top-right`, `left`, `center`, `right`, `bottom-left`, `bottom`, `bottom-right`; default `bottom-right`.
- `--opacity <OPACITY>`: `0.0` to `1.0`; default `0.3`.
- `--scale <SCALE>`: watermark scale relative to longest input edge; default `0.2`.
- Global: `--json`, `--quiet`, `--output`.

## Output

Watermarked image files.

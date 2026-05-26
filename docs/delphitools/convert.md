# convert

Convert images between formats with optional resize.

## Inputs

- `IMAGES` optional variadic: input image paths.
- `--to <TO>` required: target format.

## Options

- `--to <TO>`: `png`, `jpeg`, `jpg`, `webp`, `gif`, `tiff`, `bmp`, or `ico`.
- `--quality <QUALITY>`: JPEG/WebP quality `1` to `100`; default `85`.
- `--resize <RESIZE>`: `WxH`, `Wx`, `xH`, or `P%`, e.g. `800x600` or `50%`.
- Global: `--json`, `--quiet`, `--output`.

## Output

Converted image files.

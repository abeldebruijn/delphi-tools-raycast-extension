# rmbg

Remove background from images.

## Inputs

- `IMAGES` optional variadic: input image paths.

## Options

- `--approve`: pre-approve the one-time model download; required in non-interactive mode.
- Global: `--json`, `--quiet`, `--output`.

## Output

Images with background removed.

## Notes

First use downloads an approximately 170 MB Apache-licensed ONNX model.

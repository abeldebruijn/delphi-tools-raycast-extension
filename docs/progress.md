# delphitools Raycast Extension Progress

Hardness estimates are for wrapping each `delphitools` command as a Raycast command. Raycast ease estimates how naturally the command maps to Raycast UI patterns.

## Not started

| Tool                                        | Extension hardness | Raycast ease | Progress    |
| ------------------------------------------- | ------------------ | ------------ | ----------- |
| [crop](./delphitools/crop.md)               | Moderate           | Moderate     | Not started |
| [favicon](./delphitools/favicon.md)         | Moderate           | Moderate     | Not started |
| [font-info](./delphitools/font-info.md)     | Moderate           | Moderate     | Not started |
| [noise](./delphitools/noise.md)             | Moderate           | Moderate     | Not started |
| [palette](./delphitools/palette.md)         | Moderate           | Easy         | Not started |
| [preflight](./delphitools/preflight.md)     | Hard               | Moderate     | Not started |
| [qr](./delphitools/qr.md)                   | Moderate           | Easy         | Not started |
| [regex](./delphitools/regex.md)             | Easy               | Easy         | Not started |
| [remove background](./delphitools/rmbg.md)  | Hard               | Moderate     | Not started |
| [scroll](./delphitools/scroll.md)           | Hard               | Moderate     | Not started |
| [split](./delphitools/split.md)             | Moderate           | Moderate     | Not started |
| [optimise SVG files](./delphitools/svgo.md) | Moderate           | Moderate     | Not started |
| [trace](./delphitools/trace.md)             | Hard               | Moderate     | Not started |
| [watermark](./delphitools/watermark.md)     | Moderate           | Moderate     | Not started |
| [zine](./delphitools/zine.md)               | Hard               | Moderate     | Not started |

## Implemented

| Tool                                                | Progress                                                                                                                                                                                                                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [decode](./delphitools/decode.md)                   | Implemented as a clipboard/selection-first Command with base64 and URL support                                                                                                                                                                                                       |
| [encode](./delphitools/encode.md)                   | Implemented as a clipboard/selection-first Command with base64 and URL support                                                                                                                                                                                                       |
| [hash](./delphitools/hash.md)                       | Implemented as a clipboard/selection-first Command with md5, sha1, sha256, and sha512 support                                                                                                                                                                                        |
| [contrast](./delphitools/contrast.md)               | Implemented as a live foreground/background colour Form; accepts hex, CSS names, rgb(), and hsl(). Could add an external service to render some text on top of background as an image. The url would be `https://tools.rmv.fyi/tools/contrast-checker/image-preview?fg=<fg>&bg=<bg>` |
| [harmony](./delphitools/harmony.md)                 | Implemented as a live base-colour Form with all 12 harmony-genny types, copy actions, and a local preview image route                                                                                                                                                                |
| [colorblind](./delphitools/colorblind.md)           | Implemented as a colour-only simulator with all nine colour blindness modes, live CLI output, copy actions, and a local preview image route                                                                                                                                          |
| [line-height](./delphitools/line-height.md)         | Implemented as a List of named ratios for the active font size with persisted font size, recent font sizes, and copy actions                                                                                                                                                         |
| [shavian](./delphitools/shavian.md)                 | Implemented as a live text Form with argument, selected-text, then clipboard input precedence; debounced transliteration, optional JSON gloss preview, copy actions, and gloss markdown export                                                                                       |
| [paper](./delphitools/paper.md)                     | Implemented as a searchable paper-size List for A, B, C, and US series with mm/in/pt units, DPI-aware pixel dimensions, copy actions, and a compare Detail with a local SVG preview                                                                                                  |
| [font-info](./delphitools/font-info.md)             | Implemented as a single font file-picker Form for TTF, OTF, WOFF, and WOFF2 files with structured metadata Detail, copy JSON, copy summary, and reveal actions                                                                                                                       |
| [colorblind image](./delphitools/colorblind.md)     | Implemented as a file-picker Form that writes a temporary simulated image preview with open, copy-image, copy-path, and switch-mode actions for all nine colour blindness modes; defaults to deuteranopia                                                                            |
| [barcode](./delphitools/barcode.md)                 | Implemented as a Form that generates a temporary barcode PNG with format, height, and scale controls; supports ean13, ean8, upca, code39, code128, codabar, code93, and itf; text labels are omitted until CLI font support is available                                             |
| [clip](./delphitools/clip.md)                       | Implemented as a batch PNG file-picker Form that trims transparent edges into a temporary output directory with List results, open, copy-image, copy-path, copy-all-paths, and reveal actions                                                                                        |
| [convert](./delphitools/convert.md)                 | Implemented as a batch image file-picker Form that converts to png, jpeg, jpg, webp, gif, tiff, bmp, or ico with quality and optional resize controls, temporary output List results, and open/copy/reveal actions                                                                   |
| [crop](./delphitools/crop.md)                       | Implemented as a batch image file-picker Form that crops to a shared ratio and position, writes to a temporary output directory, and shows List results with open, copy-image, copy-path, copy-all-paths, and reveal actions                                                         |
| [favicon](./delphitools/favicon.md)                 | Implemented as a single-image Form that generates configured favicon sizes and optional favicon.ico into a temporary output directory with open, copy-file, copy-path, copy-all-paths, and reveal actions                                                                            |
| [impose](./delphitools/impose.md)                   | Implemented as a PDF file-picker Form for `saddle-stitch`, `perfect-bind`, and `n-up` layouts with paper, n-up, signature, margin, gutter, creep, crop-mark, and duplex controls; writes a temporary imposed PDF with preview, open, copy-file, copy-path, and reveal actions        |
| [matte](./delphitools/matte.md)                     | Implemented as a batch image file-picker Form with blur, solid, and gradient styles; `1:1`, `4:5`, `3:4`, `9:16`, and custom ratio support; writes temporary matted images with open, copy-image, copy-path, copy-all-paths, and reveal actions                                      |
| [meta](./delphitools/meta.md)                       | Implemented as a live metadata Form with title and description character-count guidance, optional URL/image/page type/site name/author/Twitter handle fields, copy meta tags action, and preview Detail                                                                              |
| [tailwind shades](./delphitools/tailwind-shades.md) | Implemented as a required base-colour Command argument with optional classic/vivid/muted/hue-shift mode, direct swatch List output, per-shade copy actions, and CSS variable, OKLCH variable, Tailwind config, and shade-scale copy actions                                          |

## Not planned (already in Raycast core)

| Tool                              | Progress                              |
| --------------------------------- | ------------------------------------- |
| [base](./delphitools/base.md)     | Not planned (already in Raycast core) |
| [calc](./delphitools/calc.md)     | Not planned (already in Raycast core) |
| [colour](./delphitools/colour.md) | Not planned (already in Raycast core) |
| [glyph](./delphitools/glyph.md)   | Not planned (already in Raycast core) |
| [px2rem](./delphitools/px2rem.md) | Not planned (already in Raycast core) |
| [rem2px](./delphitools/rem2px.md) | Not planned (already in Raycast core) |
| [time](./delphitools/time.md)     | Not planned (already in Raycast core) |
| [typo](./delphitools/typo.md)     | Not planned (already in Raycast core) |
| [unit](./delphitools/unit.md)     | Not planned (already in Raycast core) |
| [word count](./delphitools/wc.md) | Not planned (already in Raycast core) |

# delphitools Raycast Extension Progress

Hardness estimates are for wrapping each `delphitools` command as a Raycast command. Raycast ease estimates how naturally the command maps to Raycast UI patterns.

## Not started

| Tool                                                | Extension hardness | Raycast ease | Progress    |
| --------------------------------------------------- | ------------------ | ------------ | ----------- |
| [barcode](./delphitools/barcode.md)                 | Moderate           | Moderate     | Not started |
| [clip](./delphitools/clip.md)                       | Moderate           | Moderate     | Not started |
| [convert](./delphitools/convert.md)                 | Moderate           | Moderate     | Not started |
| [crop](./delphitools/crop.md)                       | Moderate           | Moderate     | Not started |
| [favicon](./delphitools/favicon.md)                 | Moderate           | Moderate     | Not started |
| [font-info](./delphitools/font-info.md)             | Moderate           | Moderate     | Not started |
| [impose](./delphitools/impose.md)                   | Hard               | Moderate     | Not started |
| [line-height](./delphitools/line-height.md)         | Easy               | Easy         | Not started |
| [matte](./delphitools/matte.md)                     | Moderate           | Moderate     | Not started |
| [meta](./delphitools/meta.md)                       | Easy               | Easy         | Not started |
| [noise](./delphitools/noise.md)                     | Moderate           | Moderate     | Not started |
| [palette](./delphitools/palette.md)                 | Moderate           | Easy         | Not started |
| [paper](./delphitools/paper.md)                     | Easy               | Easy         | Not started |
| [preflight](./delphitools/preflight.md)             | Hard               | Moderate     | Not started |
| [qr](./delphitools/qr.md)                           | Moderate           | Easy         | Not started |
| [regex](./delphitools/regex.md)                     | Easy               | Easy         | Not started |
| [remove background](./delphitools/rmbg.md)          | Hard               | Moderate     | Not started |
| [scroll](./delphitools/scroll.md)                   | Hard               | Moderate     | Not started |
| [shavian](./delphitools/shavian.md)                 | Easy               | Easy         | Not started |
| [split](./delphitools/split.md)                     | Moderate           | Moderate     | Not started |
| [optimise SVG files](./delphitools/svgo.md)         | Moderate           | Moderate     | Not started |
| [tailwind shades](./delphitools/tailwind-shades.md) | Easy               | Easy         | Not started |
| [trace](./delphitools/trace.md)                     | Hard               | Moderate     | Not started |
| [watermark](./delphitools/watermark.md)             | Moderate           | Moderate     | Not started |
| [zine](./delphitools/zine.md)                       | Hard               | Moderate     | Not started |

## Implemented

| Tool                                      | Progress                                                                                                                                                                                                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [decode](./delphitools/decode.md)         | Implemented as a clipboard/selection-first Command with base64 and URL support                                                                                                                                                                                                       |
| [encode](./delphitools/encode.md)         | Implemented as a clipboard/selection-first Command with base64 and URL support                                                                                                                                                                                                       |
| [hash](./delphitools/hash.md)             | Implemented as a clipboard/selection-first Command with md5, sha1, sha256, and sha512 support                                                                                                                                                                                        |
| [contrast](./delphitools/contrast.md)     | Implemented as a live foreground/background colour Form; accepts hex, CSS names, rgb(), and hsl(). Could add an external service to render some text on top of background as an image. The url would be `https://tools.rmv.fyi/tools/contrast-checker/image-preview?fg=<fg>&bg=<bg>` |
| [harmony](./delphitools/harmony.md)       | Implemented as a live base-colour Form with all 12 harmony-genny types, copy actions, and a local preview image route                                                                                                                                                                |
| [colorblind](./delphitools/colorblind.md) | Implemented as a colour-only simulator with all nine colour blindness modes, live CLI output, copy actions, and a local preview image route                                                                                                                                          |

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

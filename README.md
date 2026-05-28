# Delphitools

Run local design and text utilities from [delphitools](https://tools.rmv.fyi/) in Raycast.

## Commands

- Check Delphitools Install
- Delphitools
- Encode Text
- Decode Text
- Hash Text
- Check Contrast
- Generate Color Harmony
- Simulate Color Blindness
- Simulate Color Blindness (Image)
- Generate Barcode
- Trim Transparent Edges
- Convert Images
- Favicon Generator
- Social Media Cropper
- Generate Tailwind Shades
- Compute Line Height
- Paper Sizes
- Font File Explorer
- Transliterate to Shavian

## Setup

This extension uses the local `delphitools` CLI. Install it before running commands that call delphitools:

```sh
cargo install delphitools-cli
```

After installation, run `Check Delphitools Install` in Raycast to confirm the CLI is available on your `PATH`.

## Requirements

- Raycast
- Rust and Cargo, used to install the local `delphitools` CLI

## Notes

All processing runs locally through the CLI. Generated previews are temporary local files and do not require a web server.

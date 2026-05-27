# delphi-tools-raycast-extension

A Raycast Extension for wrapping [delphitools](https://tools.rmv.fyi/) into Raycast commands. Each delphitools utility is intended to become its own discoverable Raycast command.

This project is in heavy development. Current implementation status is tracked in [docs/progress.md](docs/progress.md).

## What is included

Implemented commands:

- Check Delphitools Install
- Delphitools
- Encode Text
- Decode Text
- Hash Text
- Check Contrast
- Generate Colour Harmony
- Simulate Colour Blindness
- Simulate Colour Blindness (Image)
- Generate Barcode
- Trim Transparent Edges
- Convert Images
- Generate Tailwind Shades
- Line Height
- Paper Sizes
- Transliterate to Shavian

The extension is a local-first Raycast-native wrapper over the `delphitools` CLI. Core tool execution is intended to run locally through the CLI rather than through hosted processing.

## Images

The extension uses both SVG and PNG images:

- Command icons in `assets/` are SVG files, matching the existing beige-background delphitools icon style.
- The extension icon remains `assets/extension-icon.png`.
- Generated previews are temporary local image files referenced from Raycast markdown with `![alt](path)`.

Preview formats depend on the command:

- Colour swatches and colour-blindness image output use PNG files.
- Contrast text previews and paper-size comparisons use SVG files.

These previews are generated locally by the extension or by the local `delphitools` CLI. They do not require a separate localhost web preview server.

## Requirements

- Raycast
- Node.js and npm
- Rust and Cargo, for installing the `delphitools` CLI

## Run the extension

Install dependencies:

```sh
npm install
```

Start Raycast development mode:

```sh
npm run dev
```

Install the local CLI:

```sh
cargo install delphitools-cli
```

You can check whether the CLI is available with the `Check delphitools Install` command in Raycast.

## Scripts

- `npm run dev`: start the Raycast extension in development mode
- `npm run lint`: run Raycast linting
- `npm run build`: build the extension
- `npm run publish`: publish to the Raycast Store

## Contributing

Follow the existing command patterns in `src/` when adding new delphitools commands. Update [docs/progress.md](docs/progress.md) when a command changes status.

## License

MIT

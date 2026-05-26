# delphi-tools-raycast-extension

A Raycast Extension for wrapping [delphitools](https://tools.rmv.fyi/) into Raycast commands. Each delphitools utility is intended to become its own discoverable Raycast command.

This project is in heavy development. Current implementation status is tracked in [docs/progress.md](docs/progress.md).

## What is included

Implemented commands:

- Check delphitools Install
- delphitools
- Encode Text
- Decode Text
- Hash Text
- Check Contrast
- Generate Colour Harmony

The extension is a local-first Raycast-native wrapper over the `delphitools` CLI. Core tool execution is intended to run locally through the CLI rather than through hosted processing.

## Image previews

Some commands render preview images. The preview image routes currently come from [abeldebruijn/delphitools `codex/add-urltoimage-routes`](https://github.com/abeldebruijn/delphitools/tree/codex/add-urltoimage-routes), which is a fork of [1612elphi/delphitools](https://github.com/1612elphi/delphitools).

The extension fetches these previews as images because Raycast extensions do not allow arbitrary HTML styling. Rendering styled previews in the forked web app and loading them as images lets the Raycast command show richer visual output while staying within Raycast's extension UI constraints.

At the moment, this Raycast extension fetches those preview images from `http://localhost:3000`:

- Contrast preview: `http://localhost:3000/contrast-checker/image`
- Harmony preview: `http://localhost:3000/harmony-genny/image`

This is subject to change as the project develops.

## Requirements

- Raycast
- Node.js and npm
- Rust and Cargo, for installing the `delphitools` CLI
- The forked delphitools repo running locally if you want image previews

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

## Run local image preview routes

Clone the fork that currently hosts the preview image routes:

```sh
git clone https://github.com/abeldebruijn/delphitools.git
cd delphitools
git checkout codex/add-urltoimage-routes
```

Then run that repo's web app or server on `localhost:3000` using its own instructions.

## Scripts

- `npm run dev`: start the Raycast extension in development mode
- `npm run lint`: run Raycast linting
- `npm run build`: build the extension
- `npm run publish`: publish to the Raycast Store

## Contributing

Follow the existing command patterns in `src/` when adding new delphitools commands. Update [docs/progress.md](docs/progress.md) when a command changes status.

## License

MIT

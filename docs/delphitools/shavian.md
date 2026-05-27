# shavian

Transliterate English text to the Shavian alphabet.

## Inputs

- `INPUT` optional: text, file path, or stdin.

## Options

- `--gloss`: show side-by-side Latin, Shavian, and IPA gloss.
- Global: `--json`, `--quiet`, `--output`.

## Output

Shavian transliteration.

## Raycast command plan

Expose `shavian` as its own root-search Raycast Command with a generated command icon.

The Command should be live-preview first. It accepts optional root-search text, then falls back to selected text and clipboard text. As the user edits the input, it should update the Shavian transliteration preview and keep `Copy Shavian` as the first action.

Gloss output should be supported in v1, but per-word marker cycling from the web version should be deferred unless the CLI exposes stable inputs for it. In v1, render marker status from CLI gloss output when available and provide copy/export actions for the gloss.

### Stepped implementation plan

1. Generate `assets/shavian-icon.svg`.
2. Add a `shavian` entry to the Raycast manifest with optional `text` argument.
3. Create `src/shavian.tsx`.
4. Use the text-to-text input precedence: Raycast argument, selected text, clipboard text.
5. Render a Form with a text area and live output preview.
6. Debounce CLI execution while typing.
7. Run plain transliteration for the primary live result.
8. Add a gloss toggle or action that also runs `delphitools shavian --gloss`.
9. Render gloss output in a readable preview, using structured sections or markdown tables depending on the CLI output shape.
10. Add actions for `Copy Shavian`, `Copy Input`, `Copy Gloss`, and `Export Gloss`.
11. Do not implement per-word marker cycling in v1 unless the CLI provides a direct, stable API for it.
12. Run the build so generated Raycast argument types are updated.
13. Move this Tool from `Not started` to `Implemented` in `docs/progress.md` when complete.

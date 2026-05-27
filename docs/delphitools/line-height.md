# line-height

Compute line-height values for a font size.

## Inputs

- `FONT_SIZE` optional: font size in pixels; default `16`.
- `NAME` optional: one named ratio: `tight`, `snug`, `normal`, `relaxed`, `loose`, or `golden`.

## Options

- Global: `--json`, `--quiet`, `--output`.

## Output

Line-height values for the font size.

## Raycast command plan

Expose `line-height` as its own root-search Raycast Command with a generated command icon.

The Command should open as a List view. It defaults to font size `16`, accepts an optional root-search `fontSize` argument, and renders all named ratios as List items for the current font size. Each item should show the ratio name and computed line-height value, with copy actions for the selected result.

Users should be able to change the font size after launch. Because Raycast Lists do not provide arbitrary text inputs inline, add a `Change Font Size` action that pushes a small Form and returns to the List with the new value.

Use [storage](https://developers.raycast.com/api-reference/storage) to persist the active font size across sessions. Add actions to use one of the last 5 font sizes used (present as recent font sizes: `use 15px as font size` etc). Do not duplicate font sizes in the recent font size list. Move the last used font size to the top of the list.

### Stepped implementation plan

1. Generate `assets/line-height-icon.svg`.
2. Add a `line-height` entry to the Raycast manifest with optional `fontSize` text argument.
3. Create `src/line-height.tsx`.
4. Default the active font size to `16` when no argument is provided.
5. Run `delphitools line-height <fontSize> --json` whenever the font size changes.
6. Render one List item per named ratio: `tight`, `snug`, `normal`, `relaxed`, `loose`, and `golden`.
7. Add item actions to copy the computed line-height, copy a CSS declaration, and copy all ratios.
8. Add `Change Font Size` as an Action Panel action that pushes a Form for entering a new font size.
9. Add actions to use one of the last 5 font sizes used.
10. Run the build so generated Raycast argument types are updated.
11. Move this Tool from `Not started` to `Implemented` in `docs/progress.md` when complete.

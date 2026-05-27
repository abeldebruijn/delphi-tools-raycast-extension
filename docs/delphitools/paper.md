# paper

Look up paper size dimensions.

## Inputs

- `NAME` optional: paper size name.

## Options

- `--series <SERIES>`: filter/list by paper series.
- `--unit <UNIT>`: output unit; default `mm`.
- `--dpi <DPI>`: pixels-per-inch for pixel output; default `72`.
- `--pixels`, `-p`: include pixel dimensions.
- Global: `--json`, `--quiet`, `--output`.

## Output

Paper dimensions in the requested unit.

## Raycast command plan

Expose `paper` as its own root-search Raycast Command with a generated command icon.

The Command should open as a searchable List of paper sizes. It defaults to millimeters, supports filtering by paper series, supports optional pixel dimensions, and keeps DPI configurable as a secondary setting. Each paper size should be a List item with dimensions visible in the subtitle or accessories.

Add compare mode inside the same Command rather than as a separate root-search Command. A selected paper size should offer `Compare With...`, then push a second searchable List for choosing another size. The comparison result should open in a Detail view with dimensions, ratios, and a proportional preview.

For the compare preview, try generating a temporary SVG file and embedding it in Detail markdown with `![preview](file-path)`. If Raycast does not render local SVG reliably during verification, fall back to a generated PNG.

### Stepped implementation plan

1. Generate `assets/paper-icon.svg`.
2. Add a `paper` entry to the Raycast manifest with optional `name` text argument.
3. Create `src/paper.tsx`.
4. Build the main view as a searchable List with state for search text, series, unit, pixel toggle, and DPI.
5. Default unit to `mm`, no series filter, pixels off, and DPI `72`.
6. Discover or encode supported series and units from the CLI behavior and docs.
7. Run `delphitools paper --json` with `--series`, `--unit`, `--pixels`, and `--dpi` based on the current state.
8. Render each paper size as a List item with dimensions and series metadata.
9. Add actions to copy dimensions, copy dimensions with pixels, change unit, change series, toggle pixels, and set DPI.
10. Add `Compare With...` to each List item.
11. Implement the comparison picker as a second searchable List.
12. Implement the comparison Detail view with textual dimensions, scale/area comparison, and the generated temporary SVG preview.
13. Add comparison actions to copy the comparison summary, copy the left size, copy the right size, and choose another comparison size.
14. Run the build so generated Raycast argument types are updated.
15. Move this Tool from `Not started` to `Implemented` in `docs/progress.md` when complete.

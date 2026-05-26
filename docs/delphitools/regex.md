# regex

Test a regex pattern against text.

## Inputs

- `PATTERN` required: Rust regex syntax.
- `TEXT` optional: text, file path, or stdin.

## Options

- `--flags <FLAGS>`: `g` find all, `i` case-insensitive, `m` multiline, `s` dot-all, `x` extended; default `g`.
- Global: `--json`, `--quiet`, `--output`.

## Output

Regex match results.

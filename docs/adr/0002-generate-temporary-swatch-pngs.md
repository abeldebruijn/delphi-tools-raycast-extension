# Generate temporary swatch PNGs

Commands that need colour previews should generate solid-colour PNG swatches inside the Raycast Extension instead of depending on local web preview routes, storing image bytes in Raycast storage APIs, or adding an image-generation dependency.

Swatches are generated with Node built-ins only. A command passes a 6-digit hex colour and a command-specific namespace to the shared swatch helper. The helper normalises the hex value, creates a deterministic file path under the system temporary directory with `os.tmpdir()` and `path.join()`, creates the directory recursively, writes a small RGBA PNG, and returns the file path for Raycast markdown.

The PNG writer emits a minimal PNG: signature, IHDR, deflated IDAT data, and IEND. Each image row uses filter byte `0`; each pixel is RGBA with alpha `255`. Default swatches are `180x96`, with optional width and height overrides for commands that need a different preview shape. Text labels, colour names, and hex values stay in Raycast markdown rather than being baked into the image.

Temporary paths are disposable and deterministic. The operating system may remove them, and commands should regenerate missing swatches rather than treating them as durable state. The namespace keeps generated files grouped per Command, for example `colorblind` and `harmony`.

We considered Raycast `LocalStorage`, Raycast `Cache`, extension support paths, and localhost web preview URLs. `LocalStorage` and `Cache` are string-oriented and better suited to small settings or metadata, not PNG files that Raycast markdown needs to load by path. Extension support paths are better for durable generated assets, but these previews are disposable. Localhost routes contradict the Raycast-native, local-first wrapper direction by requiring a separate web server. Generating temp files keeps previews local, cross-platform, dependency-free, and reusable across commands.

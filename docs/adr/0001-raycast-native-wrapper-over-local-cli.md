# Raycast-native wrapper over local CLI

We will build this project as a Raycast-native workflow layer over the local `delphitools` CLI, not as a thin terminal launcher, CLI reimplementation, or website-driven integration. The extension requires a `delphitools` executable on `PATH`, installed with `cargo install delphitools-cli`; when it is missing, the extension should show installation guidance instead of falling back to network or website behavior.

Per-tool Raycast commands should be generated or synced from a machine-readable CLI manifest so Raycast stays discoverable while the delphitools catalogue evolves. All user inputs and files must stay local: no hosted processing, accounts, tracking, website scraping, or web API dependency.

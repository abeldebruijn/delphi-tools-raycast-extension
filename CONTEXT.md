# delphitools Raycast Extension

This context names the product language for a Raycast extension that brings delphitools into Raycast. It keeps the extension aligned with delphitools' small-tool, local-first, privacy-respecting ethos.

## Language

**delphitools**:
A local CLI-backed collection of small, low-stakes utilities surfaced through Raycast. delphitools is the execution engine for the extension.
_Avoid_: delphi-tools, Delphi CLI, CLI replacement

**Delphi**:
The tool suite and product context behind delphitools. It does not mean the Delphi programming language or unrelated Delphi tooling.
_Avoid_: Delphi language, Embarcadero Delphi

**Raycast Extension**:
The user-facing workflow layer that exposes delphitools inside Raycast. It presents commands, forms, results, clipboard actions, and install guidance without owning the tool logic.
_Avoid_: CLI replacement, web wrapper

**Tool**:
One focused utility from the delphitools catalogue. A Tool belongs to delphitools and may be exposed as its own Raycast command.
_Avoid_: App, feature, website page

**CLI Manifest**:
A machine-readable description of available Tools and their input/output shape. The Raycast Extension uses it as the source of truth for per-tool commands.
_Avoid_: Website scrape, web API, hard-coded catalogue

## Flagged Ambiguities

**delphi-tools**:
Use only for repository, package, or generated command naming. In product language, use **delphitools**.

**Wrapper**:
Use **Raycast Extension** when referring to the user-facing Raycast layer. The extension wraps local CLI execution, not the delphitools website.

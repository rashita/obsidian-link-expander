# Link Expander for Obsidian

This is a plugin for [Obsidian](https://obsidian.md).

## Features

This plugin provides commands to manage tabs based on the internal links in your current active note.

- **Open all links in new tabs**: Finds all internal links in the currently active note and opens them in new tabs. After opening, the focus returns to the original note.
- **Close all linked tabs**: Closes all tabs that correspond to the internal links in the currently active note. This is useful for cleaning up your workspace after you're done referencing the linked notes.

## Usage

1. Open a note in Obsidian.
2. Open the Command Palette (`Cmd/Ctrl + P`).
3. Search for "Link Expander".
4. Select one of the commands:
    - `Link Expander: Open all links in new tabs`
    - `Link Expander: Close all linked tabs`

## Installation

### Manually installing the plugin

1. Copy `main.js`, `manifest.json`, `styles.css` to your vault's `.obsidian/plugins/obsidian-link-expander/` folder.
2. Reload Obsidian or reload plugins.
3. Enable "Link Expander" in Community Plugins settings.

## License

MIT

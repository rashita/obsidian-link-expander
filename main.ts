import { Plugin, MarkdownView, FileView } from 'obsidian';

export default class LinkExpanderPlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: 'open-all-internal-links',
            name: 'Open all links in new tabs',
            checkCallback: (checking: boolean) => {
                const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (markdownView) {
                    if (!checking) {
                        this.openAllLinks(markdownView);
                    }
                    return true;
                }
                return false;
            }
        });

        this.addCommand({
            id: 'close-all-linked-tabs',
            name: 'Close all linked tabs',
            checkCallback: (checking: boolean) => {
                const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (markdownView) {
                    if (!checking) {
                        this.closeAllLinkedTabs(markdownView);
                    }
                    return true;
                }
                return false;
            }
        });
    }

    async openAllLinks(view: MarkdownView) {
        const file = view.file;
        if (!file) return;

        const cache = this.app.metadataCache.getFileCache(file);
        if (!cache || !cache.links) {
            console.log("Link Expander: No links found in this note.");
            return;
        }

        console.log(`Link Expander: Found ${cache.links.length} links.`);

        // Deduplicate links based on the link target
        const uniqueLinks = new Set<string>();
        cache.links.forEach(link => {
            // Normalize header/block refs if needed, but for now just taking the link path
            uniqueLinks.add(link.link);
        });

        for (const linkPath of uniqueLinks) {
            await this.app.workspace.openLinkText(linkPath, file.path, true);
        }

        // Refocus the original leaf
        this.app.workspace.setActiveLeaf(view.leaf, { focus: true });
    }

    async closeAllLinkedTabs(view: MarkdownView) {
        const file = view.file;
        if (!file) return;

        const cache = this.app.metadataCache.getFileCache(file);
        if (!cache || !cache.links) {
            console.log("Link Expander: No links found in this note to close.");
            return;
        }

        const uniqueLinks = new Set<string>();
        cache.links.forEach(link => {
            uniqueLinks.add(link.link);
        });

        const leavesToDetach: any[] = [];
        this.app.workspace.iterateAllLeaves(leaf => {
            // Skip the current active leaf where the command was triggered
            if (leaf === view.leaf) return;

            if (leaf.view instanceof FileView) {
                const leafFile = leaf.view.file;
                if (leafFile) {
                    for (const linkText of uniqueLinks) {
                        const targetFile = this.app.metadataCache.getFirstLinkpathDest(linkText, file.path);
                        if (targetFile && targetFile.path === leafFile.path) {
                            leavesToDetach.push(leaf);
                            break;
                        }
                    }
                }
            }
        });

        leavesToDetach.forEach(leaf => leaf.detach());
    }
}

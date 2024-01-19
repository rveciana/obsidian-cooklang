import {
    App,
    Platform,
    Plugin,
    PluginSettingTab,
    TextFileView,
    WorkspaceLeaf,
    setIcon,
} from "obsidian";

import { DEFAULT_SETTINGS, type CookLangSettings } from "./settings";
import View from "./ui/View.svelte";
import Edit from "./ui/Edit.svelte";

const VIEW_TYPE = "svelte-view";

// Remember to rename these classes and interfaces!

const DEFAULT_DATA = "";

class CooklangSvelteView extends TextFileView {
    view: View | Edit;
    mode: "source" | "preview" = "preview";
    changeModeButton: HTMLElement;
    data: string = DEFAULT_DATA;
    settings: CookLangSettings;

    constructor(leaf: WorkspaceLeaf, settings: CookLangSettings) {
        super(leaf);
        this.settings = settings;
    }

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Recipe";
    }

    getIcon(): string {
        return "microphone";
    }

    async onOpen(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.view = new View({
            target: (this as any).contentEl,
            props: { data: this.data },
        });

        //Adds the icon to switch mode
        this.changeModeButton = this.addAction(
            "pencil",
            "Preview (Ctrl+Click to open in new pane)",
            () => this.switchMode(),
            17
        );
    }

    getViewData(): string {
        return this.data;
    }
    setViewData(data: string): void {
        this.data = data;
        this.view.$set({ data });
    }
    clear(): void {
        this.data = "";
    }

    switchMode() {
        this.mode = this.mode === "preview" ? "source" : "preview";
        setIcon(
            this.changeModeButton,
            this.mode === "preview" ? "pencil" : "lines-of-text"
        );
        this.contentEl.innerHTML = "";

        this.view =
            this.mode === "preview"
                ? new View({
                      target: this.contentEl,
                      props: { data: this.data },
                  })
                : new Edit({
                      target: this.contentEl,
                      props: {
                          data: this.data,
                          onChange: (newData) => (this.data = newData),
                      },
                  });
    }
}

export default class CooklangPlugin extends Plugin {
    private view: CooklangSvelteView;
    settings: CookLangSettings;

    async onload() {
        await this.loadSettings();

        this.registerView(
            VIEW_TYPE,
            (leaf: WorkspaceLeaf) =>
                (this.view = new CooklangSvelteView(leaf, this.settings))
        );

        this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));

        // This creates an icon in the left ribbon.
        this.addRibbonIcon("microphone", "Sample Plugin", (evt: MouseEvent) =>
            this.openMapView()
        );

        // register the view and extensions
        this.registerView("cook", this.cookViewCreator);
        this.registerExtensions(["cook"], "cook");

        // This adds a simple command that can be triggered anywhere
        this.addCommand({
            id: "open-sample-modal-simple",
            name: "Open sample modal (simple)",
            callback: () => this.openMapView(),
        });
        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new SampleSettingTab(this.app, this));
    }
    cookViewCreator = (leaf: WorkspaceLeaf) => {
        return new CooklangSvelteView(leaf, this.settings);
    };
    onLayoutReady(): void {
        if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: VIEW_TYPE,
        });
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async openMapView() {
        const workspace = this.app.workspace;
        workspace.detachLeavesOfType(VIEW_TYPE);
        const leaf = workspace.getLeaf(
            // @ts-ignore
            !Platform.isMobile
        );
        await leaf.setViewState({ type: VIEW_TYPE });
        workspace.revealLeaf(leaf);
    }
}

class SampleSettingTab extends PluginSettingTab {
    plugin: CooklangPlugin;

    constructor(app: App, plugin: CooklangPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl("h2", { text: "Settings for my awesome plugin." });
    }
}

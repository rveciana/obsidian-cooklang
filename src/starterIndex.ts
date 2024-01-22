import {
    Plugin,
    TFile,
    TextFileView,
    WorkspaceLeaf,
    setIcon
} from "obsidian";


import i18next from "i18next";
import { resources } from "./lang/resources";
import Edit from "./ui/Edit.svelte";
import View from "./ui/View.svelte";
import { DEFAULT_SETTINGS, Settings, type CookLangSettings } from "./ui/Settings";
import { getI18n, isTFile } from "./ui/utils";

const VIEW_TYPE = "svelte-cooklang";


i18next.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: resources,
     interpolation: {
       escapeValue: false, // not needed for svelte as it escapes by default
     }
   });

// Remember to rename these classes and interfaces!

const DEFAULT_DATA = "";

class CooklangSvelteView extends TextFileView {
    view: View | Edit;
    mode: "source" | "preview" = "preview";
    changeModeButton: HTMLElement;
    data: string = DEFAULT_DATA;
    images: Record<string, string> = {};
    settings: CookLangSettings;

    constructor(leaf: WorkspaceLeaf, settings: CookLangSettings) {
        super(leaf);
        this.settings = settings;
    }

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        if (this.file) return this.file.basename;
        else return "Cooklang (no file)";
    }

    getIcon(): string {
        return "microphone";
    }

    async onOpen(): Promise<void> {
       this.renderPreview();
        //Adds the icon to switch mode
        this.changeModeButton = this.addAction(
            "pencil",
            "Preview (Ctrl+Click to open in new pane)",
            () => this.switchMode(),
            17
        );
    }

    renderPreview(){
        this.view =
            this.mode === "preview"
                ? new View({
                      target: this.contentEl,
                      props: { data: this.data, images: this.images, settings: this.settings },
                  })
                : new Edit({
                      target: this.contentEl,
                      props: {
                          data: this.data,
                          onChange: (newData:string) => (this.data = newData),
                      },
                  });
    }

    getViewData(): string {
        return this.data;
    }
    setViewData(data: string): void {
        
        const images = (
            this.file.parent.children.filter(
                (f) => isTFile(f) &&
                    (f.basename === this.file.basename ||
                        f.basename.startsWith(this.file.basename + ".")) &&
                    f.name != this.file.name &&
                    ["png", "jpg", "jpeg", "gif"].includes(f.extension)
                    ) as TFile[]
        ).reduce((acc, f) => {
            const split = f.basename.split(".");
            if (split.length > 1) {
                const name = split[1];
                acc[name] = this.app.vault.getResourcePath(f);
            } else {
                acc["recipe"] = this.app.vault.getResourcePath(f);
            }
            return acc;
        }, {} as Record<string, string>);
        this.images = images;
        
        const lang = getI18n(data);
        i18next.changeLanguage(lang);

        this.data = data;

        this.view.$set({ data, images });
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

        this.renderPreview()
    }
}

export default class CooklangPlugin extends Plugin {
    private view: CooklangSvelteView;
    settings: CookLangSettings;
    

    async onload() {
        await this.loadSettings();
;
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
        this.addSettingTab(new Settings(this.app, this));
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

    reloadPluginViews() {
        console.log("reload", this.app.workspace.getLeavesOfType(VIEW_TYPE));
        this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach(leaf => {
          if(leaf.view instanceof CooklangSvelteView) {
            leaf.view.settings = this.settings;
            leaf.view.renderPreview();
          }
        });
      }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async openMapView() {
        let newFileFolderPath;

        newFileFolderPath = `Untitled.cook`;
        let i = 0;

        while (this.app.vault.getAbstractFileByPath(newFileFolderPath)) {
            newFileFolderPath = `Untitled ${++i}.cook`;
        }
        const newFile = await this.app.vault.create(newFileFolderPath, "");
        this.app.workspace.getLeaf().openFile(newFile);
        return newFile;
    }
}


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
            (e) => { this.switchMode(e.metaKey || e.ctrlKey);},
            17
        );
    }

    renderPreview(newTab=false){
        this.contentEl.innerHTML = "";
        

        const newElement = this.mode === "preview"
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
        if(newTab){
            const newTab = this.app.workspace.getLeaf(true);
            newTab.openFile(this.file);
        } else { 
            this.view = newElement;
        }
        
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
        
        if(this.settings.autoLanguage){
            const lang = getI18n(data);
            i18next.changeLanguage(lang);
        }

        this.data = data;

        this.view.$set({ data, images });
        
    }
    clear(): void {
        this.data = "";
    }

    switchMode(newTab=false) {
        this.mode = this.mode === "preview" ? "source" : "preview";
        setIcon(
            this.changeModeButton,
            this.mode === "preview" ? "pencil" : "lines-of-text"
        );

        this.renderPreview(newTab)
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


        // register the view and extensions
        this.registerView("cook", this.cookViewCreator);
        this.registerExtensions(["cook"], "cook");


        this.addCommand({
            id: "create-cooklang",
            name: "Create new recipe",
            callback: async () => {
              const newFile = await this.openMapView();
              this.app.workspace.getLeaf().openFile(newFile);
            }
          })

          this.addCommand({
            id: "create-cooklang-new-tab",
            name: "Create new recipe on a new tab",
            callback: async () => {
              const newFile = await this.openMapView();
              this.app.workspace.getLeaf(true).openFile(newFile);
            }
          })

          this.addCommand({
            id: "convert-to-cooklang",
            name: "Convert markdown file to `.cook`",
            checkCallback: (checking:boolean) => {
              const file = this.app.workspace.getActiveFile();
              const isMd = file?.extension === "md";
              if(checking) {
                return isMd;
              }
              else if(isMd) {
                // replace last instance of .md with .cook
                this.app.vault.rename(file,file.path.replace(/\.md$/, ".cook")).then(() => {
                  this.app.workspace.getLeaf().openFile(file);
                });
              }
            }
          })

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
        this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach(leaf => {
          if(leaf.view instanceof CooklangSvelteView) {
            leaf.view.settings = {...this.settings};
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


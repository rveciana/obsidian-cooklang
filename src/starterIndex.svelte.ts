import {
    Plugin,
    TFile,
    TextFileView,
   type WorkspaceLeaf,
    setIcon
} from "obsidian";


import i18next from "i18next";
import { resources } from "./lang/resources.js";

import Edit from "./ui/Edit.svelte";
import View from "./ui/View.svelte";

import { DEFAULT_SETTINGS, Settings, type CookLangSettings } from "./ui/Settings.js";
import { getI18n, isTFile } from "./ui/utils.js";
import { mount, unmount } from "svelte";
import { Parser, type ParseResult } from "@cooklang/cooklang-ts";

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
    view!: View | Edit;
    mode: "source" | "preview" = "preview";
    changeModeButton!: HTMLElement;
    data: string = DEFAULT_DATA;
    images: Record<string, string> = {};
    settings: CookLangSettings;
    props = $state({data:DEFAULT_DATA, images:{}, settings: DEFAULT_SETTINGS});


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
        return "chef-hat";
    }

    async onOpen(): Promise<void> {
       this.renderPreview();
        //Adds the icon to switch mode
        this.changeModeButton = this.addAction(
            "pencil",
            "Preview (Ctrl+Click to open in new pane)",
            (e) => { this.switchMode(e.metaKey || e.ctrlKey);}
            
        );
    }

    renderPreview(newTab=false){
       
        const container = this.contentEl.createEl("div");

        const newElement = this.mode === "preview"?
        mount(View , {target: container, props: this.props})
        :
        mount(Edit, {target: container,
                     props: {data: this.props.data, 
                        onChange: (newData:string) => {
                            this.props.data = newData; 
                            this.data = newData;
                        }}
                        })


        if(newTab && this.file){
            const newTab = this.app.workspace.getLeaf(true);
            newTab.openFile(this.file);
        } else { 
            if (this.view) {
                unmount(this.view);
            }
            this.view = newElement;
        }
        
    }

    getViewData(): string {
        return this.data;
    }

    setViewData(data: string): void {
        
        const images = (
            this.file?.parent?.children.filter(isTFile).filter(
                (f) => (f.basename === this.file?.basename ||
                        f.basename.startsWith(this.file?.basename + ".")) &&
                    f.name != this.file?.name &&
                    ["png", "jpg", "jpeg", "gif","webp"].includes(f.extension)
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

        const recipe: ParseResult = new Parser().parse(data);
        if(recipe.metadata.locale){
            const lang = recipe.metadata.locale.split("_")[0]
            i18next.changeLanguage(lang);
        } else if(this.settings.autoLanguage){
            const lang = getI18n(data);            
            i18next.changeLanguage(lang);
        }

        this.data = data;

        this.props.data = data;
        this.props.images = images;

        this.renderPreview(false)
        
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
    settings: CookLangSettings = DEFAULT_SETTINGS;
    

    async onload() {
        await this.loadSettings();

        this.registerView(
            VIEW_TYPE,
            (leaf: WorkspaceLeaf) =>
                (new CooklangSvelteView(leaf, this.settings))
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
        this.app.workspace.getRightLeaf(false)?.setViewState({
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


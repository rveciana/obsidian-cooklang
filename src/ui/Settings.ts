import { App, PluginSettingTab, Setting } from "obsidian";
import type CooklangPlugin from "src/starterIndex";

export  class Settings extends PluginSettingTab {
    plugin: CooklangPlugin;
    constructor(app: App, plugin: CooklangPlugin) {
      super(app, plugin);
      this.plugin = plugin;
    }


    display(): void {
        const { containerEl } = this;
    
        containerEl.empty();

        new Setting(containerEl)
          .setName('Find recipe language automatically')
          .setDesc('Detect the language of the recipe so the sections are in the same language as the rest of your notes')
          .addToggle(toggle => toggle
            .setValue(this.plugin.settings.autoLanguage)
            .onChange((value: boolean) => {
              this.plugin.settings.autoLanguage = value;
              this.plugin.saveData(this.plugin.settings);
              this.plugin.reloadPluginViews();
            }));
    
    
        new Setting(containerEl)
          .setName('Show images')
          .setDesc('Show images in the recipe (see https://cooklang.org/docs/spec/#adding-pictures)')
          .addToggle(toggle => toggle
            .setValue(this.plugin.settings.showImages)
            .onChange((value: boolean) => {
              this.plugin.settings.showImages = value;
              this.plugin.saveData(this.plugin.settings);
              this.plugin.reloadPluginViews();
            }));
    
        new Setting(containerEl)
          .setName('Show ingredient list')
          .setDesc('Show the list of ingredients at the top of the recipe')
          .addToggle(toggle => toggle
            .setValue(this.plugin.settings.showIngredientList)
            .onChange((value: boolean) => {
              this.plugin.settings.showIngredientList = value;
              this.plugin.saveData(this.plugin.settings);
              this.plugin.reloadPluginViews();
            }));
    
        new Setting(containerEl)
          .setName('Show cookware list')
          .setDesc('Show the list of cookware at the top of the recipe')
          .addToggle(toggle => toggle
            .setValue(this.plugin.settings.showCookwareList)
            .onChange((value: boolean) => {
              this.plugin.settings.showCookwareList = value;
              this.plugin.saveData(this.plugin.settings);
              this.plugin.reloadPluginViews();
            }));
    
        new Setting(containerEl)
          .setName('Show quantities inline')
          .setDesc('Show the ingredient quantities inline in the recipe method')
          .addToggle(toggle => toggle
            .setValue(this.plugin.settings.showQuantitiesInline)
            .onChange((value: boolean) => {
              this.plugin.settings.showQuantitiesInline = value;
              this.plugin.saveData(this.plugin.settings);
              this.plugin.reloadPluginViews();
            }));

        new Setting(containerEl)
            .setName('Show quantities as fractions')
            .setDesc('Show the ingredient quantities as fractions instead of decimals, if possible')
            .addToggle(toggle => toggle
              .setValue(this.plugin.settings.showFractionsInQuantities)
              .onChange((value: boolean) => {
                this.plugin.settings.showFractionsInQuantities = value;
                this.plugin.saveData(this.plugin.settings);
                this.plugin.reloadPluginViews();
              }));
        
       
}}


export interface CookLangSettings {
    autoLanguage: boolean;
    showImages: boolean;
    showIngredientList: boolean;
    showCookwareList: boolean;
    showQuantitiesInline: boolean;
    showFractionsInQuantities: boolean;
}

export const DEFAULT_SETTINGS: CookLangSettings = {
    autoLanguage: true,
    showImages: true,
    showIngredientList: true,
    showCookwareList: true,
    showQuantitiesInline: false,
    showFractionsInQuantities: true,
};
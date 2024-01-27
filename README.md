# Cooklang

This plugin allows you to edit and view recipes written in the Cooklang format.

![Screenshot](https://raw.githubusercontent.com/rveciana/obsidian-cooklang/main/header.png)

## Installation

- You can find this plugin in the *Community Plugins* section inside the Settings.
- To develop, you can download the code into the *.obsidian/plugins* folder in a vault and run `npm install` and `npm run dev` to see the changes.

## Features

- Multi language: The titles for the sections (i.e. *ingredients*, *cookware* and so on) will be translated into the recipe language or the one configured in the Obsidian settings


## Changelog

- 0.0.1: Support for *source* and *servings* metadata.
- 0.0.0: Initial version. Can edit, view, and select the language.

## Acknowledgments

- This plugin is obviously inspired by [cooklang-obsidian](https://github.com/cooklang/cooklang-obsidian) by [deathau](https://github.com/deathau). I wanted to learn how to code for Obsidian and add multi-language capabilities to the Cooklang plugin.

- The plugin is using cooklang-ts, which passes all the tests and seems better than the other JavaScript alternatives.

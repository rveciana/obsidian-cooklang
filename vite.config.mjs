import path from 'path';
import { defineConfig } from 'vite';

import esbuildSvelte from 'esbuild-svelte';
import sveltePreprocess from 'svelte-preprocess';
import builtins from 'builtin-modules';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { svelte } from '@sveltejs/vite-plugin-svelte';


const prod = (process.argv[2] === 'production');

export default defineConfig(() => {
    return {
        plugins: [
    svelte({
      preprocess: sveltePreprocess({ typescript: true,
        }), 
    }),
            esbuildSvelte({
      compilerOptions: { css: 'injected' },
    }),
            viteStaticCopy({
                targets: [
                    {
                    src: 'build/main.js',
                    dest: '..',
                    },
                    {
                    src: 'build/styles.css',
                    dest: '..', 
            }
       ],
      watch: false,
    }),
        ],
        watch: !prod,
        build: {
            sourcemap: prod ? false : 'inline',
            minify: prod,
            // Use Vite lib mode https://vitejs.dev/guide/build.html#library-mode
            commonjsOptions: {
                ignoreTryCatch: false,
            },
            lib: {
                entry: path.resolve(__dirname, './src/starterIndex.svelte.ts'),
                formats: ['cjs'],
            },
            css: {},
            rollupOptions: {
                output: {
                    // Overwrite default Vite output fileName
                    entryFileNames: 'main.js',
                    assetFileNames: 'styles.css',
                },
               
                external: ['obsidian',
                    'electron',
                    "codemirror",
                    "@codemirror/autocomplete",
                    "@codemirror/closebrackets",
                    "@codemirror/collab",
                    "@codemirror/commands",
                    "@codemirror/comment",
                    "@codemirror/fold",
                    "@codemirror/gutter",
                    "@codemirror/highlight",
                    "@codemirror/history",
                    "@codemirror/language",
                    "@codemirror/lint",
                    "@codemirror/matchbrackets",
                    "@codemirror/panel",
                    "@codemirror/rangeset",
                    "@codemirror/rectangular-selection",
                    "@codemirror/search",
                    "@codemirror/state",
                    "@codemirror/stream-parser",
                    "@codemirror/text",
                    "@codemirror/tooltip",
                    "@codemirror/view",
                    "@lezer/common",
                    "@lezer/lr",
                    "@lezer/highlight",
                    ...builtins,
                ],
            },
            // Use root as the output dir
             outDir: './build',
                emptyOutDir: false,
        },
    }
});

<script lang="ts">
    import { Parser, type ParseResult } from '@cooklang/cooklang-ts';
    import { tooltip } from '@svelte-plugins/tooltips';
    import i18n from '../lang/i18n';
	import { getI18n } from './utils';


    export let data:string;
    export  let images: Record<string, string> = {}
    let recipe: ParseResult;
   
     $: recipe = new Parser().parse(data);
        
</script>

<div>
    {#if data.length === 0}
        <p>{$i18n.t('empty')}</p>
    
    {:else}
    
    {#if images.recipe}
        <img class="image-main" src={images.recipe} alt="Final result" />
    {/if}
    {#if recipe.ingredients.length > 0}
    <section class="section">
        <h3 class="section-title">{$i18n.t('ingredients')}</h3>
        <ul class="ingredients">
            {#each recipe.ingredients as ingredient}
                <li>{ingredient.quantity} {ingredient.units} {ingredient.name}</li>
            {/each}
        </ul>
    </section>  
    {/if}
    {#if recipe.cookwares.length > 0}
    <section class="section">
    <h3 class="section-title">{$i18n.t('cookware')}</h3>
    <ul class="cookware">
        {#each recipe.cookwares as cookware}
            <li>{cookware.name}</li>
        {/each}
    </ul>
</section>
{/if}
    <h2 class="H2">{$i18n.t('method')}:</h2>
    
    <div>
        {#each recipe.steps as step, i}
           <h3>{$i18n.t('step')} {i+1}</h3>
           {#if images[i]}
             <img src={images[i]} alt="Final result" />
            {/if}
           <p>
           {#each step as stepPart}
             {#if stepPart.type === 'text'}
                <span>{stepPart.value}</span>
             {:else if stepPart.type === 'ingredient'}
                <span class="ingredient"  use:tooltip={{ content: `${stepPart.quantity} ${stepPart.units} ${stepPart.name}`, action:'hover', autoPosition:true, arrow: false }}>{stepPart.name}</span>
             {:else if stepPart.type === 'cookware'}
                <span class="cookware" >{stepPart.name}</span>
             {:else if stepPart.type === 'timer'}
                <span class="timer">{stepPart.quantity} {stepPart.units}</span>
             {/if}
            
           {/each}
           </p>
        {/each}
        </div>
        {/if}
</div>

<style>
.image-main{
   
width: 100%;}
    section {
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        padding: 10px;
        margin-top: 10px;
        position: relative;
        
    }
    .section-title {
        display: inline-block;
        left: 5px;
        top: -1.5rem;
        position: absolute;

            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            padding-left: 0.75rem;
    padding-right: 0.75rem;

   
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
        }
   ul.ingredients{
    column-count: 2;
   }

   ul.cookware{
    column-count: 2;
   }

   span.cookware {
    font-weight: 600;
   }

   span.ingredient {
    font-weight: 600;
   }

   span.timer {
    font-weight: 600;
   }
   
   :global(.theme-light .tooltip) {
    --tooltip-background-color: rgb(235, 232, 233);
    --tooltip-color: black;
    --tooltip-box-shadow: 0 1px 8px rgb(125, 123, 123);
  }
   
</style>

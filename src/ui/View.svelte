<script lang="ts">
    import { Parser, type ParseResult } from '@cooklang/cooklang-ts';
    import { tooltip } from '@svelte-plugins/tooltips';

    export let data:string;
    let recipe: ParseResult;
   
    $: recipe = new Parser().parse(data);

    $: console.log(recipe);



</script>

<div>
    <h2 class="H2">Ingredients:</h2>
    <ul class="ingredients">
        {#each recipe.ingredients as ingredient}
            <li>{ingredient.quantity} {ingredient.units} {ingredient.name}</li>
        {/each}
    </ul>
    <h2 class="H2">Cookware:</h2>
    <ul class="cookware">
        {#each recipe.cookwares as cookware}
            <li>{cookware.name}</li>
        {/each}
    </ul>
    <h2 class="H2">Method:</h2>
    
    <div>
        {#each recipe.steps as step, i}
           <h3>Step {i+1}</h3>
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

</div>

<style>
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
   
   :global(.tooltip) {
    --tooltip-background-color: rgb(235, 232, 233);
    --tooltip-color: black;
    --tooltip-box-shadow: 0 1px 8px rgb(125, 123, 123);
  }
   
</style>

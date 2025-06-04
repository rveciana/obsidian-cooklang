<script lang="ts">
	import { Parser, type ParseResult } from '@cooklang/cooklang-ts';
	import { tooltip } from '@svelte-plugins/tooltips';
	import i18n from '../lang/i18n.js';
	import { DEFAULT_SETTINGS, type CookLangSettings } from './Settings.js';
	import { formatNumber } from './utils.js';
	import RangeSlider from 'svelte-range-slider-pips';

	let {
		data,
		images = {},
		settings = DEFAULT_SETTINGS
	}: { data: string; images: Record<string, string>; settings: CookLangSettings } = $props();

	const scales = [0.25, 0.5, 1, 1.5, 2, 3, 4];
	let scaleIdx = $state(2);
	let scale = $derived(scales[scaleIdx]);

	const translateIngredientsQuantity = (quantity: string | number, scale: number = 1) =>
		quantity === 'some'
			? $i18n.t('some')
			: formatNumber(quantity, settings.showFractionsInQuantities, scale);

	const recipe: ParseResult = new Parser().parse(data);
</script>

<div>
	{#if data.length === 0}
		<p>{$i18n.t('empty')}</p>
	{:else}
		{#if settings.showImages && images.recipe}
			<img class="image-main" src={images.recipe} alt="Final result" />
		{/if}
		{#if settings.showIngredientList && recipe.ingredients.length > 0}
			<section class="section">
				<h3 class="section-title">{$i18n.t('ingredients')}</h3>
				{#if recipe.metadata.servings}
					<p class="servings">
						{$i18n.t('servings')}: {scale * parseInt(recipe.metadata.servings)}
					</p>
				{/if}

				<ul class="ingredients">
					{#each recipe.ingredients as ingredient}
						<li>
							{translateIngredientsQuantity(ingredient.quantity, scale)}
							{ingredient.units}
							{ingredient.name}
						</li>
					{/each}
				</ul>

				<RangeSlider bind:value={scaleIdx} min={0} max={6} />
			</section>
		{/if}
		{#if settings.showCookwareList && recipe.cookwares.length > 0}
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
				<h3>{$i18n.t('step')} {i + 1}</h3>
				{#if settings.showImages && images[i]}
					<img src={images[i]} alt="Final result" />
				{/if}
				<p>
					{#each step as stepPart}
						{#if stepPart.type === 'text'}
							<span>{stepPart.value}</span>
						{:else if stepPart.type === 'ingredient'}
							<span
								class="ingredient"
								use:tooltip={{
									content: `${translateIngredientsQuantity(stepPart.quantity)} ${stepPart.units} ${stepPart.name}`,
									action: 'hover',
									autoPosition: true,
									arrow: false
								}}
								>{settings.showQuantitiesInline
									? `${translateIngredientsQuantity(stepPart.quantity)} ${stepPart.units} ${stepPart.name}`
									: `${stepPart.name}`}</span
							>
						{:else if stepPart.type === 'cookware'}
							<span class="cookware">{stepPart.name}</span>
						{:else if stepPart.type === 'timer'}
							<span class="timer">{stepPart.quantity} {stepPart.units}</span>
						{/if}
					{/each}
				</p>
			{/each}
		</div>
	{/if}

	{#if recipe.metadata.source}
		<hr />
		<p>
			{$i18n.t('source')}: <a href={recipe.metadata.source}>{recipe.metadata.source}</a>
		</p>
	{/if}
</div>

<style>
	.image-main {
		max-width: 300px;
	}
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
		background-color: var(--background-primary);
	}

	.servings {
		width: fit-content;
	}

	ul.ingredients {
		column-count: 2;
	}

	ul.cookware {
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

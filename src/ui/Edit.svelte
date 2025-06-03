<script lang="ts">
	let { data, onChange }: { data: string; onChange: (newData: string) => void } = $props();

	$effect(() => {
		if (data !== undefined) {
			onChange(data);
		}
	});
</script>

<div>
	<div
		class="content"
		contenteditable="true"
		role="textbox"
		tabindex="0"
		aria-multiline="true"
		bind:textContent={data}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				document.execCommand('insertLineBreak');
				e.preventDefault();
			}
		}}
	>
		{data}
	</div>
</div>

<style>
	.content:empty:not(:focus):before {
		content: 'Type the recipe here';
		opacity: 0.6;
	}
	.content {
		white-space: pre-line;
	}
</style>

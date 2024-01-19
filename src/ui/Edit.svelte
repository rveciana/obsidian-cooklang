<script lang="ts">
       export let data:string;
       export let onChange: (newData: string) => void;
       $: onChange(data)

</script>

<div>
    <h1 class="H1">Edit Roller</h1>
    <br>
    <div class="content" contenteditable="true" bind:textContent={data} placeholder="Type the recipe here">{data}</div>

</div>

<style>
    .H1 {
        margin-left: auto;
        margin-right: auto;
        text-align: center;
    }

    .content{
        white-space: pre
    }

    
</style>

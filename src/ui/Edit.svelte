<script lang="ts">
       export let data:string;
       export let onChange: (newData: string) => void;
       $: onChange(data)

</script>

<div>
 
    <div class="content" contenteditable="true" bind:textContent={data} placeholder="Type the recipe here">{data}</div>

</div>

<style>
  

    .content{
        white-space: pre
    }

    
</style>

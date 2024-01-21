<script lang="ts">
       export let data:string;
       export let onChange: (newData: string) => void;
       $: onChange(data)

</script>

<div>
 
    <div class="content" contenteditable="true" bind:textContent={data} >{data}</div>

</div>

<style>
  
   .content:empty:not(:focus):before {
      content: "Type the recipe here";
      opacity: 0.6;
    }
    .content{
        white-space: pre
    }

    
</style>

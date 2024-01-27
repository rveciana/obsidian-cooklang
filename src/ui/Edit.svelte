<script lang="ts">
       export let data:string;
       export let onChange: (newData: string) => void;
       $: onChange(data)

</script>

<div>
 
    <div class="content" contenteditable="true" bind:textContent={data} on:keydown={(e)=>{
        if (e.key === 'Enter') {
        document.execCommand('insertLineBreak')
        e.preventDefault()
      }}}>{data}</div>

</div>

<style>
  
   .content:empty:not(:focus):before {
      content: "Type the recipe here";
      opacity: 0.6;
    }
    .content{
        white-space: pre-line;
    }

    
</style>

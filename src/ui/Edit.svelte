<script lang="ts">
       export let data:string;
       export let onChange: (newData: string) => void;
       $: onChange(data)

</script>

<div>
    <h1 class="H1">Edit Roller</h1>
    <br>
    <input type="text" bind:value={data} />
</div>

<style>
    .H1 {
        margin-left: auto;
        margin-right: auto;
        text-align: center;
    }

    
</style>
